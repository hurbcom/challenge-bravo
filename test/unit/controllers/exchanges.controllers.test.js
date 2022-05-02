/* eslint-disable no-underscore-dangle */
const httpMocks = require('node-mocks-http');
const exchangesController = require('../../../src/controllers/exchanges.controllers');
const currenciesRepository = require('../../../src/repositories/currencies.repository');
const { generateCurrency } = require('../../factories/currencies.factories');
const exchangesService = require('../../../src/services/exchanges.services');

let req;
let res;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});

describe('Exchanges Controller', () => {
    describe('convert method', () => {
        it('should contain convert function', () => {
            expect(typeof exchangesController.convert).toBe('function');
        });
        it('should send 500 error when fails to search for `from` currency', async () => {
            currenciesRepository.retrieveCurrencyByCode = jest.fn().mockRejectedValue(new Error('Unknown error'));

            await exchangesController.convert(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Failed to calculate exchange.' });
        });
        it('should send 404 error when `from` currency is not found', async () => {
            req.query.from = 'FROM_TEST';
            currenciesRepository.retrieveCurrencyByCode = jest.fn().mockResolvedValue(undefined);

            await exchangesController.convert(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'No currency found for code \'FROM_TEST\'.' });
        });
        it('should send 500 error when fails to search for `to` currency', async () => {
            currenciesRepository.retrieveCurrencyByCode = jest.fn()
                .mockResolvedValueOnce(generateCurrency())
                .mockRejectedValue(new Error('Unknown error'));

            await exchangesController.convert(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Failed to calculate exchange.' });
        });
        it('should send 404 error when `to` currency is not found', async () => {
            req.query.to = 'TO_TEST';
            currenciesRepository.retrieveCurrencyByCode = jest.fn()
                .mockResolvedValueOnce(generateCurrency())
                .mockResolvedValue(undefined);

            await exchangesController.convert(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'No currency found for code \'TO_TEST\'.' });
        });
        it('should send 500 error when exchangesService.convert fails', async () => {
            currenciesRepository.retrieveCurrencyByCode = jest.fn()
                .mockResolvedValue(generateCurrency());

            exchangesService.convert = jest.fn().mockImplementation(() => {
                throw new Error('Unknown error');
            });

            await exchangesController.convert(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({ message: 'Failed to calculate exchange.' });
        });
        it('should send 200 success', async () => {
            req.query = {
                from: 'FROM_TEST',
                to: 'TO_TEST',
                amount: 2,
            };
            currenciesRepository.retrieveCurrencyByCode = jest.fn()
                .mockResolvedValue(generateCurrency());

            exchangesService.convert = jest.fn().mockReturnValue(4.5);

            await exchangesController.convert(req, res);

            expect(currenciesRepository.retrieveCurrencyByCode).toBeCalledTimes(2);
            expect(currenciesRepository.retrieveCurrencyByCode).toBeCalledWith('FROM_TEST');
            expect(currenciesRepository.retrieveCurrencyByCode).toBeCalledWith('TO_TEST');
            expect(exchangesService.convert).toBeCalledWith(
                expect.objectContaining(generateCurrency()),
                expect.objectContaining(generateCurrency()),
                2,
            );

            expect(res.statusCode).toBe(200);
            expect(res._isEndCalled()).toBeTruthy();
            expect(res._getData()).toStrictEqual({
                from: {
                    code: 'FROM_TEST',
                    amount: '2.00',
                },
                to: {
                    code: 'TO_TEST',
                    amount: '4.50',
                },
            });
        });
    });
});
