jest.mock('./currency.service');
jest.mock('../repositories/currency.repository');
jest.mock('./free-currency-api.service');
jest.mock('../infrastructure/factories/currency.factory');

import 'reflect-metadata';
import { ExchangeService } from './exchange.service';
import { CurrencyService } from "./currency.service";
import { CurrencyRepository } from '../repositories/currency.repository';
import { Currency } from '../models/currency.model';
import { CurrencyFactory } from '../infrastructure/factories/currency.factory';
import { FreeCurrencyApiService } from './free-currency-api.service';

describe('ExchangeService', () => {
    test('Should convert currency', async () => {
        // Arrange
        const mockGetCurrencyById = jest.fn();
        mockGetCurrencyById.mockResolvedValueOnce(new Currency('FAK', 2, new Date())
        ).mockResolvedValueOnce(new Currency('USD', 1, new Date()));

        const mockCreate = jest.fn();
        mockCreate.mockResolvedValueOnce(new Currency('FAK', 2, new Date()));
        const freeCurrencyApiServiceMock = new FreeCurrencyApiService();
        const currencyFactoryMock = new CurrencyFactory(freeCurrencyApiServiceMock);

        const currencyRepositoryMock = new CurrencyRepository(currencyFactoryMock);
        const currencyServiceMock = new CurrencyService(currencyRepositoryMock);
        currencyServiceMock.getCurrencyById = mockGetCurrencyById;
        
        const sut = new ExchangeService(currencyServiceMock);
        
        // Act
        const result = await sut.convertCurrency('FAK', 'USD', 1);
        
        // Assert
        expect(result).not.toBeNull();
        expect(result.ammount).toBe(0.5);
    });

    test('Should fail when one currency was not found', async () => {
        // Arrange
        const mockGetCurrencyById = jest.fn();
        mockGetCurrencyById.mockResolvedValueOnce(new Currency('FAK', 2, new Date())
        ).mockResolvedValueOnce(null);

        const mockCreate = jest.fn();
        mockCreate.mockResolvedValueOnce(new Currency('FAK', 2, new Date()));
        const freeCurrencyApiServiceMock = new FreeCurrencyApiService();
        const currencyFactoryMock = new CurrencyFactory(freeCurrencyApiServiceMock);

        const currencyRepositoryMock = new CurrencyRepository(currencyFactoryMock);
        const currencyServiceMock = new CurrencyService(currencyRepositoryMock);
        currencyServiceMock.getCurrencyById = mockGetCurrencyById;
        
        const sut = new ExchangeService(currencyServiceMock);
        
        // Act/Assert
        expect(sut.convertCurrency('FAK', 'USD', 1)).rejects.toThrow(new Error("One or more currencies were not found"));
    });
})
