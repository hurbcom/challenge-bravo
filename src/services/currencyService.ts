import env from "../config/envConfig";
import redis from "../database/redis";
import knex from "../database/postgres";
import { CurrencyFetch, Currency, Conversion } from "../types/currency";
import { utilsCurrency } from "../utils/utilsCurrency";
import { BadRequestError } from "../utils/apiError";

const getSupportedCurrencies = async (): Promise<string[]> => {
    const supportedCurrencies = await redis.get(`${env.KEY}-supported`);

    if (supportedCurrencies) {
        return JSON.parse(supportedCurrencies);
    }

    const currencies = await knex<Currency>("currency")
        .select("code")
        .then((data) => data.map((currency) => currency.code));

    if (currencies.length) {
        utilsCurrency.insertCurrencyOnRedis(`${env.KEY}-supported`, currencies);
        return currencies;
    }

    return currencies;
};

const getCurrencies = async (): Promise<Currency[]> => {
    const currenciesRedis = await redis.get(env.KEY);

    if (currenciesRedis) {
        return JSON.parse(currenciesRedis) as Currency[];
    }

    const supportedCurrencies = await getSupportedCurrencies();

    const response: Response = await fetch(
        "https://economia.awesomeapi.com.br/json/all"
    );
    const responseData = await response.json();

    if (!responseData) {
        throw new BadRequestError("Error fetching currencies");
    }

    const data = responseData as { [key: string]: CurrencyFetch };

    const currencies = await utilsCurrency.processAndStoreCurrencies(
        data,
        supportedCurrencies
    );

    await utilsCurrency.insertCurrencyOnRedis(env.KEY, currencies);

    return currencies;
};

const getCurrency = async (code: string): Promise<Currency> => {
    const currencyRedis = await redis.get(`${env.KEY}-${code}`);

    if (currencyRedis) {
        return JSON.parse(currencyRedis) as Currency;
    }

    const currencies: Currency[] = await getCurrencies();

    const currency = currencies.find((currency) => currency.code === code);

    if (!currency) {
        throw new BadRequestError("Currency not found");
    }

    return currency;
};

const getConversion = async (data: Conversion): Promise<Conversion> => {
    const { from, to, amount } = data;

    const currencyFrom = await getCurrency(from);
    const currencyTo = await getCurrency(to);

    const conversion = (currencyFrom.value / currencyTo.value) * amount;

    const conversionInfo: Conversion = {
        from,
        to,
        amount,
        conversion: `${conversion} ${to}`,
    };

    return conversionInfo;
};

const createCurrency = async (currency: Currency): Promise<void> => {
    const supportedCurrencies = await getSupportedCurrencies();

    if (supportedCurrencies.includes(currency.code)) {
        throw new BadRequestError("Currency already exists");
    }

    supportedCurrencies.push(currency.code);

    await knex<Currency>("currency").insert(currency);

    const currencies = await redis.get(env.KEY);

    if (currencies) {
        const currenciesParsed: Currency[] = JSON.parse(currencies);

        currenciesParsed.push(currency);

        await utilsCurrency.insertCurrencyOnRedis(env.KEY, currenciesParsed);
    }

    await utilsCurrency.insertCurrencyOnRedis(
        `${env.KEY}-${currency.code}`,
        currency
    );

    await utilsCurrency.insertCurrencyOnRedis(
        `${env.KEY}-supported`,
        supportedCurrencies
    );
};

const updateCurrency = async (
    codeParams: string,
    currency: Currency
): Promise<void> => {
    const supportedCurrencies = await currencyService.getSupportedCurrencies();

    if (!supportedCurrencies.includes(codeParams)) {
        throw new BadRequestError("Currency does not exist");
    }

    if (supportedCurrencies.includes(currency.code)) {
        throw new BadRequestError("Currency already exists");
    }

    await knex<Currency>("currency")
        .update(currency)
        .where({ code: codeParams });

    await utilsCurrency.insertCurrencyOnRedis(
        `${env.KEY}-${currency.code}`,
        currency
    );

    const currencies = await redis.get(env.KEY);

    if (currencies) {
        const currenciesParsed: Currency[] = JSON.parse(currencies);

        const index = currenciesParsed.findIndex(
            (currencyRedis) => currencyRedis.code === currency.code
        );

        currenciesParsed[index] = currency;

        await utilsCurrency.insertCurrencyOnRedis(env.KEY, currenciesParsed);
    }

    supportedCurrencies.push(currency.code);

    await utilsCurrency.insertCurrencyOnRedis(
        `${env.KEY}-supported`,
        supportedCurrencies
    );
};

const deleteCurrency = async (code: string): Promise<void> => {
    const supportedCurrencies = await currencyService.getSupportedCurrencies();

    if (!supportedCurrencies.includes(code)) {
        throw new BadRequestError("Currency does not exist");
    }

    await knex<Currency>("currency").delete().where({ code });

    await redis.del(`${env.KEY}-${code}`);

    const currencies = await redis.get(env.KEY);

    if (currencies) {
        const currenciesParsed: Currency[] = JSON.parse(currencies);

        const index = currenciesParsed.findIndex(
            (currency) => currency.code === code
        );

        currenciesParsed.splice(index, 1);

        await utilsCurrency.insertCurrencyOnRedis(env.KEY, currenciesParsed);
    }

    const supportedIndex = supportedCurrencies.findIndex(
        (currency) => currency === code
    );

    supportedCurrencies.splice(supportedIndex, 1);

    await utilsCurrency.insertCurrencyOnRedis(
        `${env.KEY}-supported`,
        supportedCurrencies
    );
};

export const currencyService = {
    getCurrencies,
    getCurrency,
    getConversion,
    getSupportedCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,
};
