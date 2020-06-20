import validationFilter from './parameterValidationFilter.js';
import errorHandlerWrapper from './requestErrorHandlerWrapper.js';

import currencyExchangeService from '../services/currencyExchangeService.js';

let exchangeConvertRequestModel = {
	params: {
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
		server.get('/exchange/convert', validationFilter(exchangeConvertRequestModel), errorHandlerWrapper(this.convertCurrenciesAsync));
	},
	async convertCurrenciesAsync(request, response, next) {
		const from = request.parsedParams.from.toUpperCase();
		const to = request.parsedParams.to.toUpperCase();
		const convertedAmount = await currencyExchangeService.convertCurrencyAsync(
			from, to, request.parsedParams.amount);

		response.send(200, {
			originalCurrency: from,
			originalAmount: request.parsedParams.amount,
			convertedCurrency: to,
			convertedAmount
		});
		return next();
	}
};

export default controller;
