import { Environment } from "@/types";
import { createMiddleware } from "hono/factory";

export const logging = createMiddleware<Environment>(async ({ var: { logger }}, next) => {
    const { info } = logger.getArea('logging')
    info('logging middleware')
    await next();
    console.log('Request', JSON.stringify(logger.dump(), null, 2), `\n\n`);
})