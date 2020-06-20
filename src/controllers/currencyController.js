import restifyErrors from 'restify-errors';

import validationFilter from './parameterValidationFilter.js';
import errorHandlerWrapper from './requestErrorHandlerWrapper.js';

import currencyService from '../services/currencyService.js';

const currencyModel = {
	isoCode: {
		isRequired: true,
		isLength: { min: 3, max: 3 }
	},
	description: {
		isRequired: true,
		isLength: { min: 10, max: 100 }
	}
};

const idRequestModel = {
	params: {
		id: {
			type: 'int'
		}
	}
};

const updateCurrencyRequestModel = Object.assign({}, idRequestModel, { body: currencyModel });

const controller = {
	set(server) {
		server.get(
			'/currency/:id',
			validationFilter(idRequestModel),
			errorHandlerWrapper(this.getCurrencyById)
		);
		server.del(
			'/currency/:id',
			validationFilter(idRequestModel),
			errorHandlerWrapper(this.removeCurrencyById)
		);
		server.put(
			'/currency/:id',
			validationFilter(updateCurrencyRequestModel),
			errorHandlerWrapper(this.updateCurrency)
		);
		server.post(
			'/currency',
			validationFilter({ body: currencyModel }),
			errorHandlerWrapper(this.createCurrency)
		);
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
		const currency = {
			id: request.parsedParams.id,
			isoCode: request.parsedBody.isoCode,
			description: request.parsedBody.description
		};

		await currencyService.updateCurrencyAsync(currency);
		response.send(200, currency);
		return next();
	},
	async createCurrency(request, response, next) {
		const currency = {
			isoCode: request.parsedBody.isoCode,
			description: request.parsedBody.description
		};

		const createdCurrency = await currencyService.createCurrencyAsync(currency);
		response.send(200, createdCurrency);
		return next();
	}
};

export default controller;
