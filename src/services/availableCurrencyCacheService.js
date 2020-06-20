import _ from 'lodash';

const CURRENCIES_CACHE_KEY = 'AvailableCurrencies';

import redisCacheRepository from '../infra/redisCacheClient.js';
import currencyRepository from '../infra/currencyRepository.js';

async function validateCurrenciesAsync(...currenciesIsoCodes) {
	const cachedCurrencies = await getAllAvailableCurrenciesAsync();

	return _.every(currenciesIsoCodes, (currencyIsoCode) => {
		return cachedCurrencies[currencyIsoCode];
	});
}

async function refreshCacheAsync() {
	const availableCurrencies = await currencyRepository.getAllCurrenciesAsync();
	const isoCodesMap = {};
	_.each(availableCurrencies, (currency) => {
		isoCodesMap[currency.isoCode] = true;
	});
	
	await redisCacheRepository.setAsync(CURRENCIES_CACHE_KEY, isoCodesMap);
	return isoCodesMap;
}

async function getAllAvailableCurrenciesAsync () {
	let cachedCurrencies = await redisCacheRepository.getAsync(CURRENCIES_CACHE_KEY);

	if (!cachedCurrencies) {
		cachedCurrencies = await refreshCacheAsync();
	}

	return cachedCurrencies;
}

export default { validateCurrenciesAsync, refreshCacheAsync, getAllAvailableCurrenciesAsync };
