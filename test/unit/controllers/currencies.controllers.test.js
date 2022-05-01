/* eslint-disable no-underscore-dangle */
const httpMocks = require('node-mocks-http');
const currenciesController = require('../../../controllers/currencies.controllers');
const currenciesRepository = require('../../../repositories/currencies.repository');
const currenciesService = require('../../../services/currencies.services');
const { generateCurrency } = require('../../factories/currencies.factories');

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
});
