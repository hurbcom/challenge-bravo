import { CurrencyRatesServiceMock } from '../currency-rates/currency-rates.mock';
import { CurrencyConverterService } from './currency-converter.service';

describe('Currency Converter Service', () => {
    let currencyConverterService: CurrencyConverterService;
    let currencyRatesServiceMock: CurrencyRatesServiceMock;

    beforeEach(async () => {
        currencyRatesServiceMock = new CurrencyRatesServiceMock();
        currencyConverterService = new CurrencyConverterService(
            currencyRatesServiceMock as any,
        );
    });

    it('should return an exception if currencies are equal', async () => {
        let err;

        const from = 'USD';
        const to = 'USD';
        const amount = 100;

        try {
            await currencyConverterService.convert(from, to, amount);
        } catch (e) {
            err = e;
        }

        expect(err.message).toMatch(
            'Looks like you are trying to convert the same currency.',
        );
    });

    it('should test a conversion', async () => {
        const from = 'USD';
        const to = 'BRL';
        const amount = 100;

        const rates = {
            USD: 1,
            BRL: 0.25,
        };

        jest.spyOn(currencyRatesServiceMock, 'getRates').mockImplementation(
            () => new Promise(resolve => resolve(rates as any)),
        );

        const convertedAmountUsdToBrl = await currencyConverterService.convert(
            from,
            to,
            amount,
        );

        const convertedAmountBrlToUsd = await currencyConverterService.convert(
            to,
            from,
            amount,
        );

        expect(convertedAmountUsdToBrl).toBe(400);
        expect(convertedAmountBrlToUsd).toBe(25);
    });
});
