import Big from "big.js";
import CurrencyCache from "../cache/currencyCache";
import AlphaVantageApiIntegration from "../integrations/alphaVantageApiIntegration";
import { validCurrencyCodes } from "../utils/validations";

export type ExchangeParams = {
    originalCurrency: string;
    finalCurrency: string;
    amount: Big;
}

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
        this.currencyCache = new CurrencyCache();
        this.alphaVantageApiIntegration = new AlphaVantageApiIntegration();
    }

    public async getSupportedCurrencies() : Promise<string[]> {
        return await this.currencyCache.getSupportedCurrencies();
    }

    public async exchange({ originalCurrency, finalCurrency, amount }: ExchangeParams) : Promise<ExchangeResult> {
        if(!validCurrencyCodes(originalCurrency, finalCurrency)) {
            throw new Error('One of the currencies provided was not valid. Ensure to be providing an existing currency code in uppercase, e.g., "USD".');
        }

        const exchangeRate = await this.alphaVantageApiIntegration.exchange(originalCurrency, finalCurrency);

        return {
            originalCurrency: originalCurrency,
            finalCurrency: finalCurrency,
            amount: amount,
            rate: exchangeRate.rate,
            result: amount.times(exchangeRate.rate)
        };
    }

}

export default new ExchangeService();
