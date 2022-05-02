const currenciesService = require('../../../services/currencies.services');
const currencyApiServices = require('../../../services/currencyApi.services');
const { generateCurrency } = require('../../factories/currencies.factories');
const { generateRates } = require('../../factories/currencyApi.factories');

describe('Currencies Service', () => {
    describe('getCurrencyRate method', () => {
        it('should contain getCurrencyRate function', () => {
            expect(typeof currenciesService.getCurrencyRate).toBe('function');
        });
        it('should throw error when fails to call api', async () => {
            currencyApiServices.getExchangeRates = jest.fn().mockRejectedValue(new Error('Unknown error'));
            await expect(currenciesService.getCurrencyRate({})).rejects.toThrow('Unknown error');
        });
        it('should return provided rate', async () => {
            const currency = generateCurrency('TEST', 1.5);

            const result = await currenciesService.getCurrencyRate(currency);

            expect(result).toBe(1.5);
        });
        it('should return api result when provided rate is null', async () => {
            const currency = generateCurrency('TEST', null);
            const rates = generateRates();
            currencyApiServices.getExchangeRates = jest.fn().mockResolvedValue(rates);

            const result = await currenciesService.getCurrencyRate(currency);

            expect(result).toBe(2.85);
        });
        it('should return api result when provided rate is undefined', async () => {
            const rates = generateRates();
            currencyApiServices.getExchangeRates = jest.fn().mockResolvedValue(rates);

            const result = await currenciesService.getCurrencyRate({ code: 'TEST' });

            expect(result).toBe(2.85);
        });
        it('should return api result when provided rate is empty', async () => {
            const currency = generateCurrency('TEST', ' ');
            const rates = generateRates();
            currencyApiServices.getExchangeRates = jest.fn().mockResolvedValue(rates);

            const result = await currenciesService.getCurrencyRate(currency);

            expect(result).toBe(2.85);
        });
    });
});
