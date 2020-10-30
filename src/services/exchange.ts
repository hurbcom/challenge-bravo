import Big from "big.js";
import currencyCache from "../cache/currencyCache";
import coinbaseIntegration from "../integrations/coinBaseIntegration";
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
    private readonly coinbaseIntegration

    constructor() {
        this.currencyCache = currencyCache;
        this.coinbaseIntegration = coinbaseIntegration;
    }

    public async getSupportedCurrencies() : Promise<string[]> {
        return await this.currencyCache.getSupportedCurrencies();
    }

    public async exchange( originalCurrency: string, finalCurrency: string, amount: Big) : Promise<ExchangeResult> {
        if(!validCurrencyCodes(originalCurrency, finalCurrency)) {
            throw new Error('One of the currencies provided was not valid. Ensure to be providing an existing currency code, e.g., "USD". The case is sensitive.');
        }

        let exchangeRate : Big | null;

        exchangeRate = await this.currencyCache.getCurrencyExchangeRate(originalCurrency, finalCurrency);

        if(!exchangeRate) {
            console.info(`The exchange rate from currency ${originalCurrency} to ${finalCurrency} could not be found on cache.`);

            const exchangeRateApiResponse = await this.coinbaseIntegration.exchange(originalCurrency);

            await this.currencyCache.setCurrencyExchangeRate(originalCurrency, exchangeRateApiResponse.rates);

            console.info(`The exchange rates from currency ${originalCurrency} were added on cache.`);

            exchangeRate = Big(exchangeRateApiResponse.rates[finalCurrency]);
        } else {
            console.info(`The exchange rate from currency ${originalCurrency} to ${finalCurrency} was successfully found on cache.`);
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
