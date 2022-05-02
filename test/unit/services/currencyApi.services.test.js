const axios = require('axios');
const currencyApiService = require('../../../src/services/currencyApi.services');
const { generateApiResponse } = require('../../factories/currencyApi.factories');

describe('Currency API Service', () => {
    describe('getExchangeRates method', () => {
        it('should contain getExchangeRates function', () => {
            expect(typeof currencyApiService.getExchangeRates).toBe('function');
        });
        it('should throw error when api call fails', async () => {
            axios.get = jest.fn().mockRejectedValue(new Error('API Error'));
            await expect(currencyApiService.getExchangeRates).rejects.toThrow('API Error');
        });
        it('should return formatted rates', async () => {
            axios.get = jest.fn().mockResolvedValue(generateApiResponse());
            const result = await currencyApiService.getExchangeRates();

            const expectedResult = { USD: 1, BRL: 4.5, EUR: 5.89 };

            expect(result).toStrictEqual(expectedResult);
        });
    });
});
