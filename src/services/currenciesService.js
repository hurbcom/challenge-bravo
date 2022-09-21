import { currenciesRepository } from '../repositories/currenciesRepository.js'

async function getCurrencies() {
	const currencies = await currenciesRepository.getAllCurrencies()

	if (!currencies)
		throw { type: 'bad_request', message: 'No currencies found' }

	return currencies
}

async function getCurrency(code) {
	const currency = await currenciesRepository.getOneCurrency(code)

	if (!currency) throw { type: 'bad_request', message: 'Currency not found' }

	return currency
}

async function create(name, code, rate) {
	const currency = await currenciesRepository.getOneCurrency(code)

	if (currency) throw { type: 'conflict', message: 'This code already exists' }

	const newCurrency = {
		name,
		code,
		rate
	}

	await currenciesRepository.createCurrency(newCurrency)
}

async function deleteCurrency(code) {
	const currency = await currenciesRepository.getOneCurrency(code)

	if (!currency) throw { type: 'bad_request', message: 'Currency not found' }

	if (currency.type === 'base')
		throw {
			type: 'conflict',
			message: `This is a base currency, can't delete it!`
		}

	await currenciesRepository.deleteCurrency(currency)
}

export const currenciesService = {
	getCurrencies,
	getCurrency,
	create,
	deleteCurrency
}
