import { CurrencyEntity } from '../../../entities/currency.entity';
import { currencyDataMock } from '../data/currency.data.mock';

export const currencyRepositoryMock = {
    findOneBy: jest.fn((where) => {
        const keys = Object.keys(where);
        return Promise.resolve(currencyDataMock.find((currency) => keys.every((key) => currency[key] === where[key])));
    }),
    getCurrencies: jest.fn().mockImplementation(() => {
        return Promise.resolve(currencyDataMock);
    }),
    addCurrency: jest.fn((currency) => {
        currencyDataMock.push(currency);
        return Promise.resolve(currency);
    }),
    updateCurrency: jest.fn((id, data) => {
        const index = currencyDataMock.findIndex((currency) => currency.id === id);
        currencyDataMock[index] = { ...currencyDataMock[index], ...data };
        return Promise.resolve(currencyDataMock[index]);
    }),
    updateCurrencyQuotes: jest.fn((quotes) => {
        quotes.forEach(async (quote) => {
            const currency = new CurrencyEntity();
            if (!quote.code) return;
            currency.code = quote.code;
            currency.name = quote.code;
            currency.ratio = 1 / Number(quote.ratio);
            currencyDataMock.push(currency);
        });
    }),
    softDeleteById: jest.fn((id: string) => {
        currencyDataMock.map((currency) => {
            if (currency.id === id) currency.isActive = false;
            return currency;
        });
    }),
};
