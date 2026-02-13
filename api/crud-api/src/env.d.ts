declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string;
        AUTH_HEADER: string;
        WEATHER_API_KEY: string;
    }
}