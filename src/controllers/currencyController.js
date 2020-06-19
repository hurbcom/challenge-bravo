
import restifyErrors from 'restify-errors';

import validationFilter from './parameterValidationFilter.js';
import handleWrapper from './requestHandlerWrapper.js';

import currencyService from '../services/currencyService.js';

const currencyModel = {
	symbol: {
		isRequired: true,
		isLength: { min: 3, max: 3 }
	},
	description: {
		isRequired: true,
		isLength: { min: 10, max: 100 }
	}
}

const idRequestModel = {
	params: {
		id: {
			type: 'int'
		}
	}
}

const updateCurrencyRequestModel = Object.assign({}, idRequestModel, {body: currencyModel});

const controller = {
	set(server) {
		server.get('/currency/:id', validationFilter(idRequestModel), handleWrapper(this.getCurrencyById));
		server.del('/currency/:id', validationFilter(idRequestModel), handleWrapper(this.removeCurrencyById));
		server.put('/currency/:id', validationFilter(updateCurrencyRequestModel), handleWrapper(this.updateCurrency));
		server.post('/currency', validationFilter({body: currencyModel}), handleWrapper(this.createCurrency));
	},
	async removeCurrencyById(request, response, next) {
		await currencyService.removeCurrencyByIAsync(request.parsedParams.id);
		response.send(200);
		return next();
	},
	async getCurrencyById(request, response, next) {
		const currency = await currencyService.getCurrencyByIdAsync(request.parsedParams.id);
		if (!currency) return next(new restifyErrors.NotFoundError());

		response.send(200, currency);
		return next();
	},
	async updateCurrency(request, response, next) {

		response.send(200)
		return next();
	},
	async createCurrency(request, response, next) {
		 
	}
};

export default controller;

