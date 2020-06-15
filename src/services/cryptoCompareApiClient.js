import axios from 'axios';
import _ from 'lodash';

import { appParameters } from '../config.js';

const http = axios.create({
	baseURL: 'https://min-api.cryptocompare.com/data',
	timeout: 1000,
	headers: {
		authorization: `Apikey ${appParameters.cryptoCompareApiKey}`
	}
});

const cryptoCompareApiClient = {
	async requestExchangeRatesAsync(availableCurrencies) {
		
		let currenciesParameter = availableCurrencies.map((currency) => {
			return currency.symbol
		}).join(',');

		const result = await http.get(`/price`, {
			params: {
				fsym: 'USD', //base currency "from symbol"
				tsyms: currenciesParameter //list of target currencies symbols 
			}
		});

		return result.data;
	}
};

export default cryptoCompareApiClient;
