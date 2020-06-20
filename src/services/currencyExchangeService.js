import _ from 'lodash';
import restifyErrors from 'restify-errors';

import exchangeRatesCacheService from './exchangeRatesCacheService.js';
import availableCurrencyCacheService from './availableCurrencyCacheService.js';

const service = {

	async convertCurrencyAsync(from, to, amount) {
		const areCurrenciesAvailable = await availableCurrencyCacheService.validateCurrenciesAsync(from, to);
		if (!areCurrenciesAvailable) throw new restifyErrors.BadRequestError('One or more informed currencies are not supported');

		const rates = await exchangeRatesCacheService.getRatesAsync(from, to);
		const result = amount / rates.sourceRate.rate *  rates.targetRate.rate;
		return _.floor(result, 3);
	},
	
}

export default service;