"use client";

import { createContext } from 'react';
import { rpcClient } from 'crud-api';

export const ClientContext = createContext<ReturnType<typeof rpcClient>>({} as ReturnType<typeof rpcClient>);

export const ClientSetup = ({ children }: { children: React.ReactNode }) => {
    const client = rpcClient(process.env.NEXT_PUBLIC_API_URL!);
    return (
        <ClientContext.Provider value={client}>
            {children}
        </ClientContext.Provider>
    )
}