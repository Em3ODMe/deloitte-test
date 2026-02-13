import { HonoResponseVariables } from "hono-utils";
import { dbModel, type DBModelContext } from "./db/model";

type Variables = {
    model: ReturnType<typeof dbModel<DBModelContext>>;
}

export type Environment = { Variables: Variables }
