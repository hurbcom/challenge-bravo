import { currenciesRepository } from '../repositories/currenciesRepository.js'

async function getCurrencies() {
	const currencies = await currenciesRepository.getAllCurrencies()

	if (!currencies)
		throw { type: 'not_found', message: 'No currencies found' }

	return currencies
}

async function getCurrency(code) {
	const currency = await currenciesRepository.getOneCurrency(code)

	if (!currency) throw { type: 'not_found', message: 'Currency not found' }

	return currency
}

async function create(name, code, rate, type) {
	const currency = await currenciesRepository.getOneCurrency(code)

	if (currency) throw { type: 'conflict', message: 'This code already exists' }

	const newCurrency = {
		name,
		code,
		rate,
		type
	}

	await currenciesRepository.createCurrency(newCurrency)
}

async function deleteCurrency(code) {
	const currency = await currenciesRepository.getOneCurrency(code)

	if (!currency) throw { type: 'not_found', message: 'Currency not found' }

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
