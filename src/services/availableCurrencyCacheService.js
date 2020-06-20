import _ from 'lodash';

const CURRENCIES_CACHE_KEY = 'AvailableCurrencies';

import redisCacheRepository from '../infra/redisCacheClient.js';
import currencyRepository from '../infra/currencyRepository.js';

async function validateCurrenciesAsync(...currencyisoCodes) {
	const cachedCurrencies = await getAllAvailableCurrenciesAsync();

	return _.every(currencyisoCodes, (currencyisoCode) => {
		return cachedCurrencies[currencyisoCode];
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

	return getAllAvailableCurrenciesAsync;
}

export default { validateCurrenciesAsync, refreshCacheAsync, getAllAvailableCurrenciesAsync };
