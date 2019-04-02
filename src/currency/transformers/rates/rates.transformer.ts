import { ICurrencyRatesList } from '../../definitions/currency';
import { CURRENCY } from '../../providers/currency';

export abstract class RatesTransformer {
    static transform(rates: any): ICurrencyRatesList {
        const ratesAsObject = {};
        const transformedRates = rates
            .filter(({ symbol }) => CURRENCY.includes(symbol))
            .map(({ symbol, rateUsd }) => ({
                symbol,
                rateUsd,
            }));

        for (const { symbol, rateUsd } of transformedRates) {
            ratesAsObject[symbol] = +rateUsd;
        }

        return ratesAsObject as ICurrencyRatesList;
    }
}
