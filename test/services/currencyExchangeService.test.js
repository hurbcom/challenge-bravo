import chai from 'chai';
import simple from 'simple-mock';
const expect = chai.expect;

import restifyErrors from 'restify-errors';
import service from '../../src/services/currencyExchangeService.js';

import availableCurrencyCacheService from '../../src/services/availableCurrencyCacheService.js';
import exchangeRatesCacheService from '../../src/services/exchangeRatesCacheService.js';

describe('CurrencyExchangeService', () => {
	beforeEach(() => {
		simple.mock(availableCurrencyCacheService, 'validateCurrenciesAsync');
		simple.mock(exchangeRatesCacheService, 'getRatesAsync');
	});
	afterEach(() => {
		simple.restore();
	});

	describe('convertCurrencyAsync', () => {
		it('Should exchange 10 USD to 50 BRL', async () => {
			//setup
			availableCurrencyCacheService.validateCurrenciesAsync.returnWith(true);
			exchangeRatesCacheService.getRatesAsync.returnWith({
				sourceRate: {
					rate: 1
				},
				targetRate: {
					rate: 5
				}
			});

			//exercise
			const result = await service.convertCurrencyAsync('USD', 'BRL', 10);

			//verify
			expect(result).to.equal(50);
		});
		it('Should error when unknown currency is passed', async () => {
			//setup
			availableCurrencyCacheService.validateCurrenciesAsync.returnWith(false);
			exchangeRatesCacheService.getRatesAsync.returnWith(null);

			//exercise
			try {
				const result = await service.convertCurrencyAsync('USD', 'XXX', 10);
				expect.fail("expected error not thrown");
			} catch(error) {
				//verify				
				expect(error).to.be.an.instanceof(restifyErrors.BadRequestError);
			}
			
		});
	});
});
