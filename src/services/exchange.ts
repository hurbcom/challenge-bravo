import Big from 'big.js';
import CurrencyCache from '../cache/currencyCache';
import CoinbaseIntegration from '../integrations/coinbaseIntegration';

export type ExchangeResult = {
    originalCurrency: string;
    finalCurrency: string;
    rate: Big;
    amount: Big;
    result: Big;
};

class ExchangeService {

    constructor(private readonly currencyCache: CurrencyCache, private readonly coinbaseIntegration: CoinbaseIntegration) {}

    public async getAvailableCurrencies(): Promise<string[]> {
        const availableCurrencies = await this.currencyCache.getAvailableCurrencies();

        if (!availableCurrencies.length) {
            const coinbaseAvailableCurrencies = await this.coinbaseIntegration.getAvailableCurrencies();

            await this.currencyCache.setAvailableCurrencies(coinbaseAvailableCurrencies);

            return coinbaseAvailableCurrencies;
        }

        return availableCurrencies;
    }

    public async getSupportedCurrencies(): Promise<string[]> {
        return await this.currencyCache.getSupportedCurrencies();
    }

    public async addSupportedCurrencies(currencies: string[]): Promise<void> {
        return await this.currencyCache.addSupportedCurrencies(currencies);
    }

    public async removeSupportedCurrencies(currencies: string[]): Promise<void> {
        return await this.currencyCache.removeSupportedCurrencies(currencies);
    }

    public async exchange(originalCurrency: string, finalCurrency: string, amount: Big): Promise<ExchangeResult> {
        let exchangeRate: Big | null;

        exchangeRate = await this.currencyCache.getCurrencyExchangeRate(originalCurrency, finalCurrency);

        if (!exchangeRate) {
            console.info(
                `The exchange rate from currency ${originalCurrency} to ${finalCurrency} could not be found on cache.`
            );

            const exchangeRateApiResponse = await this.coinbaseIntegration.exchange(originalCurrency);

            await this.currencyCache.setCurrencyExchangeRate(originalCurrency, exchangeRateApiResponse.rates);

            console.info(`The exchange rates from currency ${originalCurrency} were added on cache.`);

            exchangeRate = Big(exchangeRateApiResponse.rates[finalCurrency]);
        } else {
            console.info(
                `The exchange rate from currency ${originalCurrency} to ${finalCurrency} was successfully found on cache.`
            );
        }

        return {
            originalCurrency: originalCurrency,
            finalCurrency: finalCurrency,
            amount: amount,
            rate: exchangeRate,
            result: amount.times(exchangeRate),
        };
    }
}

export default ExchangeService;
