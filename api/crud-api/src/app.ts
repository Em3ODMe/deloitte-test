import { Hono } from 'hono'
import { jsonValidator } from 'hono-utils';
import { HTTPException } from 'hono/http-exception';
import { cors } from 'hono/cors';
import { getCountryByCapital, getCountries } from "@yusifaliyevpro/countries";
import { Environment } from './types';
import { weatherAPI } from './apis/weather';
import { dbMiddleware } from './middleware/dbMiddleware';
import { updateInput } from './db';
import 'dotenv/config'

const app = new Hono<Environment>()

app.use('*', cors({
    origin: '*',
    allowMethods: ['GET', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
}))
app.use(dbMiddleware);

const routes = app
    .get('/list/:cursor{[0-9]+}?', async ({ var: { model }, json, req }) => {
        const cursor = req.param('cursor') ? Number(req.param('cursor')) : undefined;
        const result = await model.cities.list({ limit: 500, cursor });
        return json(result);
    })
    .get('/available/:name', async ({ var: { model }, json, text, req }) => {
        const capital = req.param('name')
        const result = await model.cities.get({ name: capital });

        const country = await getCountryByCapital({
            capital,
            fields: ['name', 'population', 'latlng', 'cca2', 'cca3']
        });

        if (!country) {
            throw new HTTPException(404);
        }

        const { name, population, latlng, cca2, cca3 } = country;

        const weather = await weatherAPI({ lat: latlng[0], lon: latlng[1] });

        const mainData = { cca2, cca3, ...weather };

        if (!result) {
            const newCity = await model.cities.create({
                name: capital,
                state: name.official,
                country: name.common,
                estimatedPopulation: population,
            });

            return json({ ...newCity, ...mainData });
        }

        return json({ ...result, ...mainData });
    })
    .put('/available/:id', jsonValidator(updateInput.pick({
        estimatedPopulation: true,
        touristRating: true,
        dateEstablished: true,
    })), async ({ var: { model }, text, req }) => {
        const id = req.param('id');
        const { estimatedPopulation, touristRating, dateEstablished } = req.valid('json');
        await model.cities.update({ id, estimatedPopulation, touristRating, dateEstablished });
        return text('city-update');
    })
    .delete('/available/:id', async ({ var: { model }, text, req }) => {
        const id = req.param('id');
        await model.cities.delete({ id });
        return text('city-delete');
    })
    .get('/all', async ({ json }) => {
        const result = await getCountries({
            fields: ['capital', 'name'],
        });
        if (!result) {
            throw new HTTPException(404);
        }
        return json(result.filter(({ capital }) => capital?.[0]).map(({ capital }) => capital?.[0]) as string[]);
    });

export type API = typeof routes;

export { app };