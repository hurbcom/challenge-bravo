import { exchangeRatesRepository } from '../repositories/exchangeRatesRepository.js'

async function getCurrencies() {
	const currencies = await exchangeRatesRepository.getAllCurrencies()

	if (!currencies)
		throw { type: 'bad_request', message: 'No currencies found' }

    return currencies
}

async function create(newCurrency) {
	await exchangeRatesRepository.createCurrency(newCurrency)
}

export const currenciesService = {
    getCurrencies,
	create
}
