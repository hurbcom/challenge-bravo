import _CurrencyQuoteAPI from './CurrencyQuoteAPI';
import CurrencyMapper from '../../mappers/Currency';
import Fetch from '../../libs/Fetch';

jest.mock('../../libs/Fetch');
jest.mock('../../mappers/Currency');

const CurrencyQuoteAPI = new _CurrencyQuoteAPI(CurrencyMapper);

describe('#_generateUrl', () => {
    test('it returns {{baseUrl}}BRL-USD when passed USD as the backing currency and [BRL] as the currency code', () => {
        const baseUrl = CurrencyQuoteAPI.baseURL;
        const backingCurrencyCode = 'USD';
        const currenciesCodes = ['BRL'];

        try {
            const result =  CurrencyQuoteAPI._generateUrl(backingCurrencyCode, currenciesCodes);

            expect(result).toBeTruthy();
            expect(result).toBe(`${baseUrl}BRL-USD`);
        } catch (err) {
            expect(err).toBeFalsy;
        }
    });

    test('it returns {{baseUrl}}BRL-USD,EUR-USD when passed USD as the backing currency and [BRL, EUR] as the currencies', () => {
        const baseUrl = CurrencyQuoteAPI.baseURL;
        const backingCurrencyCode = 'USD';
        const currenciesCodes = ['BRL', 'EUR'];

        try {
            const result =  CurrencyQuoteAPI._generateUrl(backingCurrencyCode, currenciesCodes);

            expect(result).toBeTruthy();
            expect(result).toBe(`${baseUrl}BRL-USD,EUR-USD`);
        } catch (err) {
            expect(err).toBeFalsy;
        }
    });
});