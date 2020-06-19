import _ from 'lodash';
import restifyErrors from 'restify-errors';

import currencyRepository from '../infra/currencyRepository.js';

const service = {

	async getCurrencyByIdAsync(id) {
		return currencyRepository.getCurrencyByIdAsync(id);
	},

	async removeCurrencyByIAsync(id) {
		const currency = await this.getCurrencyByIdAsync(id);
		if (!currency) throw new restifyErrors.NotFoundError();
		
		await currencyRepository.deleteCurrencyByIdAsync(id);
	},

	async getCurrencyByIdAsync(id) {
		return currencyRepository.getCurrencyByIdAsync(id);
	},
	
}

export default service;