import { Environment } from "@/types";
import { createMiddleware } from "hono/factory";
import { db, dbModel, type DBModelContext } from "../db";

export const dbMiddleware = createMiddleware<Environment>(async ({ set }, next) => {
    // const authHeader = req.header('Authorization');
    const model = dbModel<DBModelContext>({ db });
    set('model', model);
    await next();
})