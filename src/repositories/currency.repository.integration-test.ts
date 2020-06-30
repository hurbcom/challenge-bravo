jest.mock('../infrastructure/factories/currency.factory');
jest.mock('../services/free-currency-api.service');
jest.genMockFromModule('pg');

import 'reflect-metadata';
import { CurrencyRepository } from "./currency.repository";
import { CurrencyFactory } from '../infrastructure/factories/currency.factory';
import { FreeCurrencyApiService } from '../services/free-currency-api.service';
import { Currency } from '../models/currency.model';

describe('CurrencyRepository', () => {

    const freeCurrencyApiServiceMock = new FreeCurrencyApiService();
    const currencyFactoryMock = new CurrencyFactory(freeCurrencyApiServiceMock);

    beforeEach(() => jest.clearAllMocks());

    test('Should get USD currency object', async () => {
        // Arrange

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
        const sut = new CurrencyRepository(currencyFactoryMock);
    
        // Act
        const result = await sut.getCurrencyById('ABC');
    
        // Assert
        expect(result).toBeNull();
    });

    test('Should get all currencies', async () => {
        // Arrange
        const sut = new CurrencyRepository(currencyFactoryMock);
        
        // Act
        const result = await sut.getAllCurrencies();
        
        // Assert
        expect(result.length).toBeGreaterThan(0);
        expect(result.filter(x => x.id === 'USD').length).toBe(1);
    });

    test('Should insert a currency', async () => {
        // Arrange
        const fakeCurrency = new Currency('FAK', 1, new Date());
        const sut = new CurrencyRepository(currencyFactoryMock);

        // Act
        await sut.insertOrUpdateCurrency(fakeCurrency);
        let allCurrencies = await sut.getAllCurrencies();

        // Assert
        expect(allCurrencies.filter(x => x.id === 'FAK').length).toBe(1);
        
        // Clear
        await sut.deleteCurrencyById('FAK');
        allCurrencies = await sut.getAllCurrencies();
        expect(allCurrencies.filter(x => x.id === 'FAK').length).toBe(1);
    });

    test('Should insert a currency', async () => {
        // Arrange
        const fakeCurrency = new Currency('FAK', 1, new Date());
        const sut = new CurrencyRepository(currencyFactoryMock);
        await sut.insertOrUpdateCurrency(fakeCurrency);
        
        // Act
        await sut.deleteCurrencyById('FAK')
        const allCurrencies = await sut.getAllCurrencies();

        // Assert
        expect(allCurrencies.filter(x => x.id === 'FAK').length).toBe(0);
    });
});