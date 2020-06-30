export const environment = {
    externalServices: {
        currencyApiUrl: "https://free.currconv.com/api/v7/convert",
        currencyApiKey: "088b2f9876b8d8881784"
    },
    connectionStrings: {
        postgres: {
            user: "postgres",
            host: process.env.NODE_ENV == 'production' ? 'postgres' : 'localhost',
            database: "CurrencyExchange",
            password: "challengeHurb",
            port: 5432
        }
    }
}
