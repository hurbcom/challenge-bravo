import axios from 'axios';
import _ from 'lodash';

import { appParameters } from '../config.js';

const http = axios.create({
	baseURL: 'http://apilayer.net/api/',
	timeout: 1000
  });

const currencyLayerApiClient = {
	async requestExchangeRatesAsync() {
		const result = await http.get(`live?access_key=${appParameters.currencyLayerApiKey}&currencies=&source=USD&format=1`);

		if (!result.data.success === true) throw new Error('External request to Currency Layer Api failed.', result);

		//currency layer's quotes are in the format 'USDEUR': 0.89, where the first 3 digits are the base currency information
		//and the last 3 are the target currency. the code below removes the suffix from the result.
		const rates = _.mapKeys(result.data.quotes, (value, key) => {
			return key.substring(3);
		});

		return rates;
	}
}

export default currencyLayerApiClient;