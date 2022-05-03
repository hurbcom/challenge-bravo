const currenciesService = require('../../../src/services/currencies.services');
const currencyApiServices = require('../../../src/services/currencyApi.services');
const { generateCurrency, generateCurrencyList } = require('../../factories/currencies.factories');
const { generateRates } = require('../../factories/currencyApi.factories');
const currenciesRepository = require('../../../src/repositories/currencies.repository');

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

    describe('updateCurrenciesRates method', () => {
        it('should contain updateCurrenciesRates function', () => {
            expect(typeof currenciesService.updateCurrenciesRates).toBe('function');
        });
        it('should throw error when it fails to list currencies', async () => {
            currenciesRepository.listCurrencies = jest.fn().mockRejectedValue(new Error('Unknown error'));

            await expect(currenciesService.updateCurrenciesRates()).rejects.toThrow('Unknown error');
        });
        it('should throw error when it fails to get exchange rates', async () => {
            currenciesRepository.listCurrencies = jest.fn().mockResolvedValue([]);
            currencyApiServices.getExchangeRates = jest.fn().mockRejectedValue(new Error('Unknown error'));

            await expect(currenciesService.updateCurrenciesRates()).rejects.toThrow('Unknown error');
        });
        it('should throw error when it fails to bulk currencies', async () => {
            currenciesRepository.listCurrencies = jest.fn().mockResolvedValue([]);
            currencyApiServices.getExchangeRates = jest.fn().mockResolvedValue({});
            currenciesRepository.bulkCurrencies = jest.fn().mockRejectedValue(new Error('Unknown error'));

            await expect(currenciesService.updateCurrenciesRates()).rejects.toThrow('Unknown error');
        });
        it('should udpdate rates and bulk currencies', async () => {
            currenciesRepository.listCurrencies = jest.fn()
                .mockResolvedValue(generateCurrencyList());
            currencyApiServices.getExchangeRates = jest.fn().mockResolvedValue(generateRates());
            currenciesRepository.bulkCurrencies = jest.fn().mockResolvedValue();

            await currenciesService.updateCurrenciesRates();

            const updatedRates = [
                {
                    code: 'USD',
                    rate: 1,
                },
                {
                    code: 'BRL',
                    rate: 4.5,
                },
                {
                    code: 'EUR',
                    rate: 5.89,
                },
            ];
            expect(currenciesRepository.listCurrencies).toBeCalledWith(true);
            expect(currenciesRepository.bulkCurrencies)
                .toBeCalledWith(expect.arrayContaining(updatedRates));
        });
    });
});
