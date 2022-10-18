import { CurrencyEntity } from '../../../entities/currency.entity';
import { currencyDataMock } from '../data/currency.data.mock';
import { currencyRepositoryMock } from '../repositories/currencyRepositoryMock';

export const currencyServiceMock = {
    getCurrency: jest.fn(() => {
        return Promise.resolve(currencyDataMock);
    }),
    getCurrencyById: jest.fn((id: string) => {
        return currencyRepositoryMock.findOneBy({ id, isActive: true });
    }),
    getCurrencyByCode: jest.fn((code: string) => {
        return currencyRepositoryMock.findOneBy({ code, isActive: true });
    }),
    createCurrency: jest.fn((data: CurrencyEntity) => {
        currencyDataMock.push(data);
        return Promise.resolve(data);
    }),
    updateCurrency: jest.fn((id: string, data) => {
        const index = currencyDataMock.findIndex((currency) => currency.id === id);
        currencyDataMock[index] = { ...currencyDataMock[index], ...data };
        return Promise.resolve(currencyDataMock[index]);
    }),
    deleteCurrency: jest.fn((id: string) => {
        currencyRepositoryMock.softDeleteById(id);
    }),
    updateQuotes: jest.fn((quotes) => currencyRepositoryMock.updateCurrencyQuotes(quotes)),
};
