import _ from 'lodash';
import restifyErrors from 'restify-errors';

import currencyRepository from '../infra/currencyRepository.js';

const service = {
	async getCurrencyByIdAsync(id) {
		return currencyRepository.getCurrencyByIdAsync(id);
	},

	async removeCurrencyByIAsync(id) {
		const dbCurrency = await this.getCurrencyByIdAsync(id);
		if (!dbCurrency) throw new restifyErrors.NotFoundError();

		await currencyRepository.deleteCurrencyByIdAsync(id);
	},

	async updateCurrencyAsync({ id, symbol, description }) {
		const dbCurrency = await currencyRepository.getCurrencyByIdAsync(id);
		if (!dbCurrency) throw new restifyErrors.NotFoundError();

		await currencyRepository.updateCurrencyAsync({ id, symbol, description });
	},

	async createCurrencyAsync({ symbol, description }) {
		const dbCurrency = await currencyRepository.getCurrencyBySymbolAsync(symbol);
		if (dbCurrency) {
			throw new restifyErrors.UnprocessableEntityError(
				`A currency with the same symbol '${symbol}' already exists.`
			);
		}

		let currency = { symbol, description };
		currency.id = await currencyRepository.createCurrencyAsync({ symbol, description });

		return currency;
	}
};

export default service;
