import { createModelFactory, initProcedure } from "model-blueprint";
import { dropQuery } from 'model-blueprint/dropQuery';
import { withCursor } from 'model-blueprint/withCursor';
import { createId } from '@paralleldrive/cuid2';
import { eq, lt, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "./setup";
import { cities } from "./schema";

export type DBModelContext = {
    db: typeof db;
}

const dropMessages = {
    notFound: 'not-found'
}

export const updateInput = z.object({
    id: z.string(),
    estimatedPopulation: z.number().optional(),
    touristRating: z.number().optional(),
    dateEstablished: z.string().optional()
})

const proc = initProcedure<DBModelContext>()
    .use(dropQuery(dropMessages))
// .use(async ({ ctx, input }) => {
//     if (ctx.authHeader !== ctx.expectedAuthHeader) throw ctx.drop('notAuthenticated', 401);
//     return { ...ctx, input };
// })

const get = proc
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
        const city = await ctx.db.select().from(cities).where(eq(cities.name, input.name)).get();
        return city;
    });


const update = proc
    .input(updateInput)
    .query(async ({ ctx, input: { id, estimatedPopulation, touristRating, dateEstablished } }) => {
        const city = await ctx.db.update(cities).set({
            estimatedPopulation,
            touristRating,
            dateEstablished,
        }).where(eq(cities.id, id)).returning({ id: cities.id });

        if (!city) throw ctx.drop('notFound', 404);
        return;
    });

const create = proc
    .input(z.object({ name: z.string(), state: z.string(), country: z.string(), estimatedPopulation: z.number(), }))
    .query(async ({ ctx, input: { name, state, country, estimatedPopulation } }) => {
        const city = await ctx.db.insert(cities).values({
            id: createId(),
            name,
            state,
            country,
            estimatedPopulation,
            createdAt: Date.now(),
        }).returning().get();
        return city;
    });

const deleteProc = proc
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
        const city = await ctx.db.delete(cities).where(eq(cities.id, input.id)).returning({ id: cities.id }).get();
        if (!city) throw ctx.drop('notFound', 404);
        return;
    });

const list = proc
    .input(z.object({ limit: z.number().optional().default(10), cursor: z.number().optional() }))
    .query(async ({ ctx, input }) => {
        const { limit, cursor } = input;
        const entries = await ctx.db.select().from(cities).where(cursor
            ? lt(cities.createdAt, cursor)
            : undefined).orderBy(desc(cities.createdAt)).limit(limit);
        return withCursor(entries, 'createdAt', limit);
    });

export const dbModel = createModelFactory({
    cities: {
        get,
        list,
        create,
        update,
        delete: deleteProc,
    }
});