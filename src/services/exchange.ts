import Big from "big.js";
import AlphaVantageApiIntegration from '../integrations/AlphaVantageApiIntegration';

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

    public async exchange(exchangeParams: ExchangeParams) : Promise<ExchangeResult> {
        const exchangeRate = await AlphaVantageApiIntegration.exchange(exchangeParams.originalCurrency, exchangeParams.finalCurrency);

        return {
            originalCurrency: exchangeParams.originalCurrency,
            finalCurrency: exchangeParams.finalCurrency,
            amount: exchangeParams.amount,
            rate: exchangeRate.rate,
            result: exchangeParams.amount.times(exchangeRate.rate)
        };
    }

}

export default new ExchangeService();
