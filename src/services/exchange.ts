import Big from "big.js";
import currencyCache from "../cache/currencyCache";
import alphaVantageApiIntegration from "../integrations/alphaVantageApiIntegration";
import { validCurrencyCodes } from "../utils/validations";

export type ExchangeResult = {
    originalCurrency: string;
    finalCurrency: string;
    rate: Big;
    amount: Big;
    result: Big;
}

class ExchangeService {

    private readonly currencyCache;
    private readonly alphaVantageApiIntegration

    constructor() {
        this.currencyCache = currencyCache;
        this.alphaVantageApiIntegration = alphaVantageApiIntegration;
    }

    public async getSupportedCurrencies() : Promise<string[]> {
        return await this.currencyCache.getSupportedCurrencies();
    }

    public async exchange( originalCurrency: string, finalCurrency: string, amount: Big) : Promise<ExchangeResult> {
        if(!validCurrencyCodes(originalCurrency, finalCurrency)) {
            throw new Error('One of the currencies provided was not valid. Ensure to be providing an existing currency code in uppercase, e.g., "USD".');
        }

        let exchangeRate : Big | null;

        exchangeRate = await this.currencyCache.getCurrencyExchangeRate(originalCurrency, finalCurrency);

        if(!exchangeRate) {
            console.info(`The exchange from currency ${originalCurrency} to ${finalCurrency} could not be found on cache.`);

            const exchangeRateApiResponse = await this.alphaVantageApiIntegration.exchange(originalCurrency, finalCurrency);

            await this.currencyCache.setCurrencyExchangeRate(originalCurrency, finalCurrency, exchangeRateApiResponse.rate);

            exchangeRate = exchangeRateApiResponse.rate;
        } else {
            console.info(`The exchange from currency ${originalCurrency} to ${finalCurrency} was successfully found on cache.`);
        }

        return {
            originalCurrency: originalCurrency,
            finalCurrency: finalCurrency,
            amount: amount,
            rate: exchangeRate,
            result: amount.times(exchangeRate)
        };
    }

}

export default new ExchangeService();
