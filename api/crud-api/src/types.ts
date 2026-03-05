import { HonoLoggerVariables } from "hono-utils";
import { dbModel, type DBModelContext } from "./db/model";

type Variables = {
    model: ReturnType<typeof dbModel<DBModelContext>>;
} & HonoLoggerVariables;

export type Environment = { Variables: Variables }
