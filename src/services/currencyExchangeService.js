import Promise from 'bluebird';
import _ from 'lodash';

import cryptoCompareApiClient from './cryptoCompareApiClient.js';
import currencyLayerApiClient from './currencyLayerApiClient.js';

import redisCacheRepository from '../infra/redisCacheRepository.js';

import { connections } from '../config.js';


async function getRatesAsync(from, to) {
	
	const results = await Promise.all([redisCacheRepository.getAsync(from), redisCacheRepository.getAsync(to)]);
	const sourceRate = results[0];
	const targetRate = results[1];

	if(!sourceRate || !targetRate) {
		await updateRatesCacheAsync();
		return getRatesAsync(from, to);
	}

	return {sourceRate, targetRate};
}

async function updateRatesCacheAsync() {
	//todo get list of available currencies from database
	const availableCurrencies = [{symbol:'USD'}, {symbol:'BRL'}, {symbol:'EUR'}, {symbol:'BTC'}, {symbol:'ETH'}];
	
	const ratesResults = await Promise.all([
		cryptoCompareApiClient.requestExchangeRatesAsync(availableCurrencies),
		currencyLayerApiClient.requestExchangeRatesAsync()
	]);
	const rates = Object.assign({}, ratesResults[0], ratesResults[1]);

	const updateDate = new Date();
	await Promise.map(
		_.keys(rates), 
		(key) => {
			return redisCacheRepository.setAsync(key, {updateDate, rate: rates[key]});
		},
		{concurrency: 10}
	);
}

const service = {

	async convertCurrencyAsync(from, to, amount) {
		//TODO validate currencies availability on database
		const rates = await getRatesAsync(from, to);

		const result = amount / rates.sourceRate.rate *  rates.targetRate.rate;
		return _.floor(result, 3);
	},
	
}

export default service;