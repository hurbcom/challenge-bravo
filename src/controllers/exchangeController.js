//import { connections } from '../config.js';
//import mySqlClient from '../infra/mysqlDbClient.js';
import validationFilter from './parameterValidationFilter.js';
import currencyExchangeService from '../services/currencyExchangeService.js';

//const currenciesDbClient = mySqlClient(connections.currenciesDb);

let exchangeConvertRequestModel = {
	query: {
		from: {
			isRequired: true,
			isLength: { min: 3, max: 3 }
		},
		to: {
			isRequired: true,
			isLength: { min: 3, max: 3 }
		},
		amount: {
			isRequired: true,
			isDecimal: { force_decimal: false, decimal_digits: '0,2', locale: 'en-US' },
			type: 'Number'
		}	
	}
};

const controller = {
	set(server) {
		server.get('/exchange/convert', validationFilter(exchangeConvertRequestModel), this.convertCurrenciesAsync);
	},
	async convertCurrenciesAsync(request, response, next) {
		try {
					
			const from = request.parsedParameters.from.toUpperCase();
			const to = request.parsedParameters.to.toUpperCase();
			const convertedAmount = await currencyExchangeService.convertCurrencyAsync(
				from, to, request.parsedParameters.amount);

			response.send(200, {
				originalCurrency: from,
				originalAmount: request.parsedParameters.amount,
				convertedCurrency: to,
				convertedAmount
			});
			return next();
		} catch (error) {
			console.error(error);
			response.send(500);
		}
	}
};

export default controller;
