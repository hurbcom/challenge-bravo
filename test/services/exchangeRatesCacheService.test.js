if (process.env.COVERAGE) {
	require('blanket')({
		pattern: require('path').resolve('../../src/services/exchangeRatesCacheService.js')
	});
}

import chai from 'chai';
import simple from 'simple-mock';
const expect = chai.expect;

import service from '../../src/services/exchangeRatesCacheService.js';

//mocks
import availableCurrencyCacheService from '../../src/services/availableCurrencyCacheService.js';
import cryptoCompareApiClient from '../../src/services/cryptoCompareApiClient.js';
import currencyLayerApiClient from '../../src/services/currencyLayerApiClient.js';

import redisCacheRepository from '../../src/infra/redisCacheClient.js';

describe('ExchangeRatesCacheService', () => {
	beforeEach(() => {
		simple.mock(availableCurrencyCacheService, 'validateCurrenciesAsync');
		simple.mock(availableCurrencyCacheService, 'getAllAvailableCurrenciesAsync');

		simple.mock(cryptoCompareApiClient, 'requestExchangeRatesAsync');
		simple.mock(currencyLayerApiClient, 'requestExchangeRatesAsync');
		simple.mock(redisCacheRepository, 'getAsync');
		simple.mock(redisCacheRepository, 'setAsync');

		//ensuring that the original methods are not called ever
		cryptoCompareApiClient.requestExchangeRatesAsync.returnWith({ USD: 1, BRL: 5 });
		currencyLayerApiClient.requestExchangeRatesAsync.returnWith({ USD: 1, BRL: 6 });
	});
	afterEach(() => {
		simple.restore();
	});

	describe('getRatesAsync', () => {
		it('Should return from cache when cache is valid without calling external apis', async () => {
			//setup
			const now = new Date();
			const USDRateCache = { rate: 1, updateDate: now };
			const BRLRateCache = { rate: 5, updateDate: now };
			redisCacheRepository.getAsync.returnWith(USDRateCache).returnWith(BRLRateCache);

			//exercise
			const result = await service.getRatesAsync('USD', 'BRL');

			//verify
			expect(result).to.deep.equal({ sourceRate: USDRateCache, targetRate: BRLRateCache });
			expect(cryptoCompareApiClient.requestExchangeRatesAsync.callCount).to.equal(0);
			expect(currencyLayerApiClient.requestExchangeRatesAsync.callCount).to.equal(0);
		});
		it('Should update from external apis when cache is outdated', async () => {
			//setup
			const now = new Date();
			const outdated = new Date();
			outdated.setDate(outdated.getDate() - 2);

			const USDRateCache = { rate: 1, updateDate: outdated };
			const BRLRateCache = { rate: 3, updateDate: outdated };
			redisCacheRepository.getAsync.returnWith(USDRateCache).returnWith(BRLRateCache);
			redisCacheRepository.setAsync.returnWith(null);

			availableCurrencyCacheService.getAllAvailableCurrenciesAsync.returnWith(['USD', 'BRL']);

			//exercise
			const result = await service.getRatesAsync('USD', 'BRL');

			//verify
			expect(result.sourceRate.rate).to.be.equal(1);
			expect(result.targetRate.rate).to.be.equal(6);
			expect(cryptoCompareApiClient.requestExchangeRatesAsync.callCount).to.equal(1);
			expect(currencyLayerApiClient.requestExchangeRatesAsync.callCount).to.equal(1);
		});
		it('Should update from external apis when cache miss', async () => {
			//setup
			redisCacheRepository.getAsync.returnWith(null);
			redisCacheRepository.setAsync.returnWith(null);
			availableCurrencyCacheService.getAllAvailableCurrenciesAsync.returnWith(['USD', 'BRL']);

			//exercise
			const result = await service.getRatesAsync('USD', 'BRL');

			//verify
			expect(result.sourceRate.rate).to.be.equal(1);
			expect(result.targetRate.rate).to.be.equal(6);
			expect(cryptoCompareApiClient.requestExchangeRatesAsync.callCount).to.equal(1);
			expect(currencyLayerApiClient.requestExchangeRatesAsync.callCount).to.equal(1);
		});
	});
});
