jest.mock('../infrastructure/factories/currency.factory');
jest.mock('../services/free-currency-api.service');

import 'reflect-metadata';
import { CurrencyRepository } from "./currency.repository";
import { CurrencyFactory } from '../infrastructure/factories/currency.factory';
import { FreeCurrencyApiService } from '../services/free-currency-api.service';
import { Currency } from '../models/currency.model';

describe('CurrencyRepository', () => {
    test('Should get USD currency object', async () => {
        // Arrange
        const mockCreate = jest.fn();
        mockCreate.mockResolvedValueOnce(new Currency('FAK', 2, new Date()));
        const freeCurrencyApiServiceMock = new FreeCurrencyApiService();
        const currencyFactoryMock = new CurrencyFactory(freeCurrencyApiServiceMock);

        const sut = new CurrencyRepository(currencyFactoryMock);
    
        // Act
        const result = await sut.getCurrencyById('USD');
    
        // Assert
        expect(result).not.toBeNull();
        expect(result?.id).toBe('USD');
        expect(result?.usdRate).toBe(1);
    });

    test('Should return null if currency was not found', async () => {
        // Arrange
        const mockCreate = jest.fn();
        mockCreate.mockResolvedValueOnce(new Currency('FAK', 2, new Date()));
        const freeCurrencyApiServiceMock = new FreeCurrencyApiService();
        const currencyFactoryMock = new CurrencyFactory(freeCurrencyApiServiceMock);

        const sut = new CurrencyRepository(currencyFactoryMock);
    
        // Act
        const result = await sut.getCurrencyById('ABC');
    
        // Assert
        expect(result).toBeNull();
    });
});