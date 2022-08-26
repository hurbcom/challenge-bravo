import { exchangeRatesRepository } from '../repositories/exchangeRatesRepository.js'

async function getCurrencies() {
	const currencies = await exchangeRatesRepository.getAllCurrencies()

	if (!currencies)
		throw { type: 'bad_request', message: 'No currencies found' }

	return currencies
}

async function getCurrency(code) {
	const currency = await exchangeRatesRepository.getOneCurrency(code)

	if (!currency) throw { type: 'bad_request', message: 'Currency not found' }

	return currency
}

async function create(name, code, rate) {
	const currency = await exchangeRatesRepository.getOneCurrency(code)

	if (currency) throw { type: 'conflict', message: 'This code already exists' }

	const newCurrency = {
		name,
		code,
		rate
	}

	await exchangeRatesRepository.createCurrency(newCurrency)
}

export const currenciesService = {
	getCurrencies,
	getCurrency,
	create
}
