jest.mock('../repositories/currency.repository');
jest.mock('./free-currency-api.service');
jest.mock('../infrastructure/factories/currency.factory');

import 'reflect-metadata';
import { CurrencyService } from './currency.service';
import { CurrencyRepository } from '../repositories/currency.repository';
import { Currency } from '../models/currency.model';
import { FreeCurrencyApiService } from './free-currency-api.service';
import { CurrencyFactory } from '../infrastructure/factories/currency.factory';
// import { Currency } from '../models/currency.model';


describe('CurrencyService', () => {

    beforeEach(() => jest.clearAllMocks());

    test('Should get call CurrencyRepository to get Currency', async () => {
        // Arrange
        const mockCreate = jest.fn();
        mockCreate.mockResolvedValueOnce(new Currency('FAK', 2, new Date()));
        const freeCurrencyApiServiceMock = new FreeCurrencyApiService();
        const currencyFactoryMock = new CurrencyFactory(freeCurrencyApiServiceMock);

        const currencyRepositoryMock = new CurrencyRepository(currencyFactoryMock);
        const sut = new CurrencyService(currencyRepositoryMock);

        // Act
        await sut.getCurrencyById('USD');

        // Assert
        expect(currencyRepositoryMock.getCurrencyById).toHaveBeenCalled();
    });

    test('Should save currency on repository', async () => {
        // Arrange
        const mockCreate = jest.fn();
        mockCreate.mockResolvedValueOnce(new Currency('FAK', 2, new Date()));
        const freeCurrencyApiServiceMock = new FreeCurrencyApiService();
        const currencyFactoryMock = new CurrencyFactory(freeCurrencyApiServiceMock);
        
        const currencyRepositoryMock = new CurrencyRepository(currencyFactoryMock);
        const sut = new CurrencyService(currencyRepositoryMock);
        const fakeData = new Currency('FAK', 1, new Date());

        // Act
        await sut.insertOrUpdateCurrency(fakeData);
        
        // Assert
        expect(currencyRepositoryMock.insertOrUpdateCurrency).toHaveBeenCalled();
    });
});
