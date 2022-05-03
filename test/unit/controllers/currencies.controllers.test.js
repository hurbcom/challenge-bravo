/* eslint-disable no-underscore-dangle */
const httpMocks = require('node-mocks-http');
const currenciesController = require('../../../src/controllers/currencies.controllers');
const currenciesRepository = require('../../../src/repositories/currencies.repository');
const currenciesService = require('../../../src/services/currencies.services');
const { generateCurrency, generateCurrencyList } = require('../../factories/currencies.factories');

let req;
let res;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});

describe('Currencies Controller', () => {
    describe('createCurrency method', () => {
        it('should contain createCurrency function', () => {
            expect(typeof currenciesController.createCurrency).toBe('function');
        });
        it('should send status 400 error when fails to validate payload', async () => {
            const validatonError = new Error('Currencies validation failed.');
            validatonError.name = 'ValidationError';
            currenciesRepository.validateCurrency = jest.fn().mockImplementation(() => {
                throw validatonError;
            });

            await currenciesController.createCurrency(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Currencies validation failed.' });
        });
        it('should send status 500 error when fails to get currency rate', async () => {
            currenciesRepository.validateCurrency = jest.fn().mockReturnValue();
            currenciesService.getCurrencyRate = jest.fn().mockRejectedValue(new Error('Unknown error'));

            await currenciesController.createCurrency(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Failed to register currency.' });
        });
        it('should send status 400 error when no currency rate was found', async () => {
            currenciesRepository.validateCurrency = jest.fn().mockReturnValue();
            currenciesService.getCurrencyRate = jest.fn().mockReturnValue(undefined);

            await currenciesController.createCurrency(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'No rate was found for this currency, please provide a rate.' });
        });
        it('should send status 500 error when fails to create currency', async () => {
            currenciesRepository.validateCurrency = jest.fn().mockReturnValue();
            currenciesService.getCurrencyRate = jest.fn().mockReturnValue(1);
            currenciesRepository.createCurrency = jest.fn().mockRejectedValue(new Error('Unknown error'));

            await currenciesController.createCurrency(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Failed to register currency.' });
        });
        it('should send status 409 error when registering duplicated code', async () => {
            currenciesRepository.validateCurrency = jest.fn().mockReturnValue();
            currenciesService.getCurrencyRate = jest.fn().mockReturnValue(1);
            const duplicatedError = new Error('duplicate key');
            duplicatedError.name = 'MongoServerError';
            currenciesRepository.createCurrency = jest.fn().mockRejectedValue(duplicatedError);

            await currenciesController.createCurrency(req, res);

            expect(res.statusCode).toBe(409);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Failed to register currency: Duplicate code.' });
        });
        it('should send status 201 when successfully created currency', async () => {
            const body = generateCurrency('TEST', 10);
            req.body = body;
            currenciesRepository.validateCurrency = jest.fn().mockReturnValue();
            currenciesService.getCurrencyRate = jest.fn().mockReturnValue(10);
            currenciesRepository.createCurrency = jest.fn().mockResolvedValue();

            await currenciesController.createCurrency(req, res);

            expect(currenciesRepository.validateCurrency)
                .toBeCalledWith(expect.objectContaining(body));
            expect(currenciesService.getCurrencyRate).toBeCalledWith(expect.objectContaining(body));
            expect(currenciesRepository.createCurrency)
                .toBeCalledWith(expect.objectContaining(body));

            expect(res.statusCode).toBe(201);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Successfully registered currency!' });
        });
    });

    describe('listCurrencies method', () => {
        it('should contain listCurrencies function', () => {
            expect(typeof currenciesController.listCurrencies).toBe('function');
        });
        it('should send status 500 error when fails to retrieve currencies', async () => {
            currenciesRepository.listCurrencies = jest.fn().mockRejectedValue(new Error('Unknown error'));

            await currenciesController.listCurrencies(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Failed to list currencies.' });
        });
        it('should send status 200 when successfully retrieved currencies', async () => {
            const list = generateCurrencyList();
            currenciesRepository.listCurrencies = jest.fn()
                .mockResolvedValue(list);

            await currenciesController.listCurrencies(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual(expect.arrayContaining(list));
        });
    });

    describe('retrieveCurrency method', () => {
        it('should contain retrieveCurrency function', () => {
            expect(typeof currenciesController.retrieveCurrency).toBe('function');
        });
        it('should send status 500 error when fails to retrieve currency', async () => {
            currenciesRepository.retrieveCurrencyByCode = jest.fn().mockRejectedValue(new Error('Unknown error'));

            await currenciesController.retrieveCurrency(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Failed to retrieve currency.' });
        });
        it('should send status 404 error when currency was not found', async () => {
            req.params = {
                code: 'TEST',
            };
            currenciesRepository.retrieveCurrencyByCode = jest.fn().mockResolvedValue();

            await currenciesController.retrieveCurrency(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'No currency found for code \'TEST\'.' });
        });
        it('should send status 200 when successfully retrieved currency', async () => {
            req.params = {
                code: 'TEST',
            };
            const currency = generateCurrency('TEST', 1);
            currenciesRepository.retrieveCurrencyByCode = jest.fn().mockResolvedValue(currency);

            await currenciesController.retrieveCurrency(req, res);

            expect(currenciesRepository.retrieveCurrencyByCode).toBeCalledWith('TEST');

            expect(res.statusCode).toBe(200);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual(expect.objectContaining(currency));
        });
    });
    describe('deleteCurrency method', () => {
        it('should contain deleteCurrency function', () => {
            expect(typeof currenciesController.deleteCurrency).toBe('function');
        });
        it('should send status 500 error when fails to retrieve currency', async () => {
            currenciesRepository.retrieveCurrencyByCode = jest.fn().mockRejectedValue(new Error('Unknown error'));

            await currenciesController.deleteCurrency(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Failed to delete currency.' });
        });
        it('should send status 404 error when currency was not found', async () => {
            req.params = {
                code: 'TEST',
            };
            currenciesRepository.retrieveCurrencyByCode = jest.fn().mockResolvedValue();

            await currenciesController.deleteCurrency(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'No currency found for code \'TEST\'.' });
        });
        it('should send status 500 error when fails to delete currency', async () => {
            const currency = generateCurrency('TEST', 1);
            currenciesRepository.retrieveCurrencyByCode = jest.fn().mockResolvedValue(currency);
            currenciesRepository.deleteCurrency = jest.fn().mockRejectedValue(new Error('Unkown error'));

            await currenciesController.deleteCurrency(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Failed to delete currency.' });
        });

        it('should send status 200 when successfully deleted currency', async () => {
            req.params = {
                code: 'TEST',
            };
            const currency = generateCurrency('TEST', 1);
            currenciesRepository.retrieveCurrencyByCode = jest.fn().mockResolvedValue(currency);
            currenciesRepository.deleteCurrency = jest.fn().mockResolvedValue();

            await currenciesController.deleteCurrency(req, res);

            expect(currenciesRepository.retrieveCurrencyByCode).toBeCalledWith('TEST');
            expect(currenciesRepository.deleteCurrency).toBeCalledWith('TEST');

            expect(res.statusCode).toBe(200);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Successfully deleted currency!' });
        });
    });
});
