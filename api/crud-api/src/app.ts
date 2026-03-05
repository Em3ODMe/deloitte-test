import { Hono } from "hono";
import { jsonValidator, logger } from "hono-utils";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { getCountryByCapital, getCountries } from "@yusifaliyevpro/countries";
import { Environment } from "./types";
import { weatherAPI } from "./apis/weather";
import { dbMiddleware } from "./middleware/dbMiddleware";
import { logging } from "./middleware/logging";
import { updateInput } from "./db";
import "dotenv/config";

const app = new Hono<Environment>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);
app.use(
  "*",
  logger({
    service: "crud-api",
  }),
);
app.use("*", logging);
app.use(dbMiddleware);

const routes = app
  .get(
    "/list/:cursor{[0-9]+}?",
    async ({ var: { model, logger }, json, req }) => {
      logger.getArea("list");
      const cursor = req.param("cursor")
        ? Number(req.param("cursor"))
        : undefined;
      const result = await model.cities.list({ limit: 500, cursor });
      return json(result);
    },
  )
  .get(
    "/available/:name",
    async ({ var: { model, logger }, json, text, req }) => {
      const { info } = logger.getArea("availableByName");
      const capital = req.param("name");

      info("Retrieving available data for city", { capital });

      const country = await getCountryByCapital({
        capital,
        fields: ["name", "population", "latlng", "cca2", "cca3"],
      });

      if (!country) {
        throw new HTTPException(404);
      }

      const { name, population, latlng, cca2, cca3 } = country;

      const weather = await weatherAPI({ lat: latlng[0], lon: latlng[1] });

      const mainData = { cca2, cca3, ...weather };

      const result = await model.cities.get({ name: capital });

      if (!result) {
        info("No existing city found, creating new one");
        const newCity = await model.cities.create({
          name: capital,
          state: name.official,
          country: name.common,
          estimatedPopulation: population,
        });

        return json({ ...newCity, ...mainData });
      }
      info("Existing city found");

      return json({ ...result, ...mainData });
    },
  )
  .put(
    "/available/:id",
    jsonValidator(
      updateInput.pick({
        estimatedPopulation: true,
        touristRating: true,
        dateEstablished: true,
      }),
    ),
    async ({ var: { model, logger }, text, req }) => {
      const { info } = logger.getArea("availableById");
      const id = req.param("id");

      info("Updating city", { id });

      const { estimatedPopulation, touristRating, dateEstablished } =
        req.valid("json");
      await model.cities.update({
        id,
        estimatedPopulation,
        touristRating,
        dateEstablished,
      });
      return text("city-update");
    },
  )
  .delete("/available/:id", async ({ var: { model, logger }, text, req }) => {
    const { info } = logger.getArea("availableById");
    const id = req.param("id");

    info("Deleting city", { id });

    await model.cities.delete({ id });
    return text("city-delete");
  })
  .get("/all", async ({ json, var: { logger } }) => {
    const { info } = logger.getArea("all");
    info("Retrieving all cities");
    const result = await getCountries({
      fields: ["capital", "name"],
    });
    if (!result) {
      throw new HTTPException(404);
    }
    return json(
      result
        .filter(({ capital }) => capital?.[0])
        .map(({ capital }) => capital?.[0]) as string[],
    );
  });

export type API = typeof routes;

export { app };
