jest.mock('../services/currency.service.ts');
jest.mock('../services/exchange.service.ts');
jest.mock('../services/free-currency-api.service');
jest.mock('../repositories/currency.repository');
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
import { FreeCurrencyApiService } from '../services/free-currency-api.service';
import { CurrencyFactory } from '../infrastructure/factories/currency.factory';

describe('CurrencyController', () => {
    const mockCreate = jest.fn();
    mockCreate.mockResolvedValueOnce(new Currency('FAK', 2, new Date()));
    const freeCurrencyApiServiceMock = new FreeCurrencyApiService();
    const currencyFactoryMock = new CurrencyFactory(freeCurrencyApiServiceMock);

    const currencyRepositoryMock = new CurrencyRepository(currencyFactoryMock);
    const currencyServiceMock = new CurrencyService(currencyRepositoryMock, freeCurrencyApiServiceMock);
    const exchangeServiceMock = new ExchangeService(currencyServiceMock);

    const currencyController = new CurrencyController(currencyServiceMock);
    const exchangeController = new ExchangeController(exchangeServiceMock);

    test('Should return 200 when found currency by id', async () => {
        // Arrange
        const fakeData = new Currency('FAK', 2, new Date());
        const mockGetCurrencyById = jest.fn();
        mockGetCurrencyById.mockResolvedValueOnce(fakeData);
        currencyServiceMock.getCurrencyById = mockGetCurrencyById;

        const sut = new Server(currencyController, exchangeController);    

        // Act/Assert
        await req(sut.server).get('/currencies/fak')
                .expect('Content-Type', /json/)
                .expect(200);
    });

    test('Should return 404 when currency wasnt found', async () => {
        // Arrange
        const mockGetCurrencyById = jest.fn();
        mockGetCurrencyById.mockResolvedValueOnce(null);
        currencyServiceMock.getCurrencyById = mockGetCurrencyById;

        const sut = new Server(currencyController, exchangeController);    

        // Act/Assert
        await req(sut.server).get('/currencies/fak')
                .expect('Content-Type', /text/)
                .expect(404, /Currency not found/);
    });

    test('Should return 201 when inserting or updating a currency', async () => {
        // Arrange
        const fakeData = new Currency('FAK', 2, new Date());
        const mockGetCurrencyById = jest.fn();
        mockGetCurrencyById.mockResolvedValueOnce(fakeData);
        currencyServiceMock.insertOrUpdateCurrency = mockGetCurrencyById;

        const sut = new Server(currencyController, exchangeController);   
        
        // Act/Assert
        await req(sut.server).post('/currencies')
                .send(fakeData)
                .expect('Content-Type', /json/)
                .expect(201, /FAK/);

        
    })
})