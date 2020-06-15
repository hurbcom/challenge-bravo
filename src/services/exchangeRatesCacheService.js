import Promise from 'bluebird';
import _ from 'lodash';
import util from 'util';
const isDate = util.types.isDate;

import cryptoCompareApiClient from './cryptoCompareApiClient.js';
import currencyLayerApiClient from './currencyLayerApiClient.js';

import redisCacheRepository from '../infra/redisCacheClient.js';

async function getRatesFromCacheAsync(from, to) {
	const results = await Promise.all([redisCacheRepository.getAsync(from), redisCacheRepository.getAsync(to)]);
	const sourceRate = results[0];
	const targetRate = results[1];

	if (!sourceRate || !targetRate) {
		return null;
	}

	return {sourceRate, targetRate};
}

async function getRatesFromExternalApisAsync(availableCurrencies) {
	const ratesResults = await Promise.all([
		cryptoCompareApiClient.requestExchangeRatesAsync(availableCurrencies),
		currencyLayerApiClient.requestExchangeRatesAsync()
	]);
	const rates = Object.assign({}, ratesResults[0], ratesResults[1]);

	return rates;
}

function validateCacheBustingDates(...cacheDates) {
	//max date for cache busting strategy: 1 day
	let limit = new Date();
	limit.setDate(limit.getDate() - 1);
	//limit.setHours(limit.getHours() -1);
	
	for (const cacheDate of cacheDates) {
		let date = cacheDate;
		if (!isDate(cacheDate)) {
			date = new Date(cacheDate);
		}

		if (date <= limit) return false;
	}

	return true;
}

async function updateRatesCacheAsync(rates) {
	const updateDate = new Date();
	await Promise.map(
		_.keys(rates), 
		(key) => {
			return redisCacheRepository.setAsync(key, {updateDate, rate: rates[key]});
		},
		{concurrency: 10}
	);
}

async function getRatesAsync(from, to) {
	let cachedRates = await getRatesFromCacheAsync(from, to);

	if(!cachedRates || !validateCacheBustingDates(cachedRates.sourceRate.updateDate, cachedRates.targetRate.updateDate)) {
		let rates = await refreshRatesAsync();
		cachedRates = {
			sourceRate: {rate:rates[from]},
			targetRate: {rate:rates[to]}
		};
	}

	return cachedRates;
}

async function refreshRatesAsync() {
	//todo get list of available currencies from database
	const availableCurrencies = [{symbol:'USD'}, {symbol:'BRL'}, {symbol:'EUR'}, {symbol:'BTC'}, {symbol:'ETH'}];
	const rates = await getRatesFromExternalApisAsync(availableCurrencies);
	await updateRatesCacheAsync(rates);

	return rates;
}

export default {getRatesAsync, refreshRatesAsync}