jest.mock('../services/currency.service.ts');
jest.mock('../services/exchange.service.ts');
jest.mock('../repositories/currency.repository');
jest.mock('../services/free-currency-api.service');
jest.mock('../infrastructure/factories/currency.factory');
import 'reflect-metadata';

import { CurrencyController } from './currency.controller';
import { CurrencyService } from '../services/currency.service';
import { CurrencyRepository  } from '../repositories/currency.repository';
import { Currency } from '../models/currency.model';

import { ExchangeController } from './exchange.controller';
import { ExchangeService } from '../services/exchange.service';

import { Server } from '../server';
import req from 'supertest';
import { ConvertedCurrency } from '../models/converted-currency.model';
import { FreeCurrencyApiService } from '../services/free-currency-api.service';
import { CurrencyFactory } from '../infrastructure/factories/currency.factory';

describe('ExchangeController', () => {
    const mockCreate = jest.fn();
        mockCreate.mockResolvedValueOnce(new Currency('FAK', 2, new Date()));
    const freeCurrencyApiServiceMock = new FreeCurrencyApiService();
    const currencyFactoryMock = new CurrencyFactory(freeCurrencyApiServiceMock);

    const currencyRepositoryMock = new CurrencyRepository(currencyFactoryMock);
    const currencyServiceMock = new CurrencyService(currencyRepositoryMock, freeCurrencyApiServiceMock);
    const exchangeServiceMock = new ExchangeService(currencyServiceMock);

    const currencyController = new CurrencyController(currencyServiceMock);
    const exchangeController = new ExchangeController(exchangeServiceMock);

    test('Should return 200 when able to convert currencies', async () => {
        // Arrange
        const fakeCurrency = new Currency('FAK', 2, new Date());
        const fakeData = new ConvertedCurrency(1, fakeCurrency, fakeCurrency);

        const mockConvertCurrency = jest.fn();
        mockConvertCurrency.mockResolvedValue(fakeData);
        exchangeServiceMock.convertCurrency = mockConvertCurrency;

        const sut = new Server(currencyController, exchangeController);    

        // Act/Assert
        await req(sut.server).get('/exchange?from=fak&to=fak&ammount=1')
                .expect('Content-Type', /json/)
                .expect(200, /FAK/);
    });

    test('Should return 400 when there are no parameters', async () => {
        // Arrange
        const mockConvertCurrency = jest.fn();
        mockConvertCurrency.mockResolvedValueOnce(null);
        exchangeServiceMock.convertCurrency = mockConvertCurrency;

        const sut = new Server(currencyController, exchangeController);    

        // Act/Assert
        await req(sut.server).get('/exchange')
                .expect('Content-Type', /text/)
                .expect(400);
    });

    test('Should return 404 when one or more currencies were not found', async () => {
        // Arrange
        const mockConvertCurrency = jest.fn();
        mockConvertCurrency.mockResolvedValueOnce(null);
        exchangeServiceMock.convertCurrency = mockConvertCurrency;

        const sut = new Server(currencyController, exchangeController);    

        // Act/Assert
        await req(sut.server).get('/exchange&from=abc&to=def&ammount=1')
                .expect('Content-Type', 'text/html; charset=utf-8')
                .expect(404);
    });
})