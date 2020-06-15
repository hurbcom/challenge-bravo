import _ from 'lodash';

import exchangeRatesCacheService from './exchangeRatesCacheService.js';

const service = {

	async convertCurrencyAsync(from, to, amount) {
		//TODO validate currencies availability on database
		const rates = await exchangeRatesCacheService.getRatesAsync(from, to);

		const result = amount / rates.sourceRate.rate *  rates.targetRate.rate;
		return _.floor(result, 3);
	},
	
}

export default service;