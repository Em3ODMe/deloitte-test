import type { API } from "./app";
import { createTypedClient } from "hono-utils";
import type { hc, InferResponseType } from 'hono/client'

export const rpcClient = (url: string) => createTypedClient<API>({ url });

export type CityData = InferResponseType<ReturnType<typeof hc<API>>['available'][':name']['$get']>
