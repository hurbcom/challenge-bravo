import { Currency, CurrencyFetch } from "./../types/currency";
import knex from "../database/postgres";
import redis from "../database/redis";
import env from "../config/envConfig";

const formatNumber = (value: number): number => {
    const index = value.toString().search("[1-9]");
    const formatted = value.toFixed(index === -1 ? 0 : index + 4);
    return Number(formatted);
};

const processAndStoreCurrencies = async (
    data: { [key: string]: CurrencyFetch },
    supportedCurrencies: string[]
) => {
    const insertions: Promise<void>[] = [];
    const filteredCurrencies: Currency[] = [];

    for (const [key, currencyFetch] of Object.entries(data)) {
        if (!supportedCurrencies.includes(key)) continue;

        const currency: Currency = {
            code: currencyFetch.code,
            name: currencyFetch.name.split("/")[0],
            value:
                key === "USD"
                    ? 1
                    : formatNumber(currencyFetch.bid / data.USD.bid),
        };

        filteredCurrencies.push(currency);
        insertions.push(insertCurrencyOnDb(currency));
    }

    const brlCurrency: Currency = {
        code: "BRL",
        name: "Real Brasileiro",
        value: formatNumber(1 / data.USD.bid),
    };

    insertions.push(insertCurrencyOnDb(brlCurrency));

    await Promise.all(insertions);

    const currencies = await knex<Currency>("currency").select(
        "code",
        "name",
        "value"
    );

    return currencies;
};

const insertCurrencyOnDb = async (currency: Currency): Promise<void> => {
    const data = await knex<Currency>("currency")
        .select("code")
        .where({ code: currency.code });

    if (data.length) {
        await knex<Currency>("currency")
            .update(currency)
            .where({ code: currency.code });

        insertCurrencyOnRedis(`${env.KEY}-${currency.code}`, currency);
        return;
    }

    await knex<Currency>("currency").insert(currency);
    insertCurrencyOnRedis(`${env.KEY}-${currency.code}`, currency);

    return;
};

const insertCurrencyOnRedis = async (key: string, data: any): Promise<void> => {
    await redis.set(key, JSON.stringify(data), { EX: 60 * 10 });
};

export const utilsCurrency = {
    formatNumber,
    insertCurrencyOnDb,
    insertCurrencyOnRedis,
    processAndStoreCurrencies,
};
