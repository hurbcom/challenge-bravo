import { RatesTransformer } from './rates.transformer';

describe('Rates Transformer', () => {
    it('should transform data', async () => {
        const untransformedRates = [
            {
                id: 'united-states-dollar',
                symbol: 'USD',
                currencySymbol: '$',
                type: 'fiat',
                rateUsd: '1.0284329473294389',
            },
            {
                id: 'brazilian-real',
                symbol: 'BRL',
                currencySymbol: 'R$',
                type: 'fiat',
                rateUsd: '0.2596357310693098',
            },
        ];

        expect(RatesTransformer.transform(untransformedRates)).toEqual({
            USD: 1.0284329473294389,
            BRL: 0.2596357310693098,
        });
    });
});
