jest.mock('./currency.service')
jest.mock('../repositories/currency.repository')
import 'reflect-metadata';
import { ExchangeService } from './exchange.service';
import { CurrencyService } from "./currency.service";
import { CurrencyRepository } from '../repositories/currency.repository';
import { Currency } from '../models/currency.model';

describe('ExchangeService', () => {
    test('Should convert currency', async () => {
        // Arrange
        const mockGetCurrencyById = jest.fn();
        mockGetCurrencyById.mockResolvedValueOnce(new Currency('FAK', 2, new Date())
        ).mockResolvedValueOnce(new Currency('USD', 1, new Date()));

        const currencyRepositoryMock = new CurrencyRepository();
        const currencyServiceMock = new CurrencyService(currencyRepositoryMock);
        currencyServiceMock.getCurrencyById = mockGetCurrencyById;
        
        const sut = new ExchangeService(currencyServiceMock);
        
        // Act
        const result = await sut.convertCurrency('FAK', 'USD', 1);
        
        // Assert
        expect(result).not.toBeNull();
        expect(result.ammount).toBe(0.5);
    });
    //TODO: Complementar
})
