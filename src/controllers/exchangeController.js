//import { connections } from '../config.js';
//import mySqlClient from '../infra/mysqlDbClient.js';
import validationFilter from './parameterValidationFilter.js';

//const currenciesDbClient = mySqlClient(connections.currenciesDb);

class Currency {
	constructor(symbol) {
		this.symbol = symbol
	}
}

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
			console.log('handling currency conversion request');
			//await currenciesDbClient.heartbeatAsync();

			response.send(200);
			return next();
		} catch (error) {
			console.error(error);
			response.send(500);
		}
	}
};

export default controller;
