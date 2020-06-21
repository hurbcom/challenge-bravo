import _ from 'lodash';
import restifyErrors from 'restify-errors';

import availableCurrencyCacheService from './availableCurrencyCacheService.js';
import currencyRepository from '../infra/currencyRepository.js';

const service = {
	async getCurrencyByIdAsync(id) {
		return currencyRepository.getCurrencyByIdAsync(id);
	},

	async removeCurrencyByIAsync(id) {
		const dbCurrency = await this.getCurrencyByIdAsync(id);
		if (!dbCurrency) throw new restifyErrors.NotFoundError();

		await currencyRepository.deleteCurrencyByIdAsync(id);

		await availableCurrencyCacheService.refreshCacheAsync();
	},

	async updateCurrencyAsync({ id, isoCode, description }) {
		const dbCurrency = await currencyRepository.getCurrencyByIdAsync(id);
		if (!dbCurrency) throw new restifyErrors.NotFoundError();

		await currencyRepository.updateCurrencyAsync({ id, isoCode, description });

		await availableCurrencyCacheService.refreshCacheAsync();
	},

	async createCurrencyAsync({ isoCode, description }) {
		const dbCurrency = await currencyRepository.getCurrencyByIsoCodeAsync(isoCode);
		if (dbCurrency) {
			throw new restifyErrors.UnprocessableEntityError(
				`A currency with the same isoCode '${isoCode}' already exists.`
			);
		}

		let currency = { isoCode, description };
		currency.id = await currencyRepository.createCurrencyAsync({ isoCode, description });

		await availableCurrencyCacheService.refreshCacheAsync();

		return currency;
	}
};

export default service;
