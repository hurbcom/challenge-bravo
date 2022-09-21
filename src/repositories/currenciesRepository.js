import { redis } from '../db.js'

async function getAllCurrencies() {
	const currencies = await redis.get('currencies')

	return JSON.parse(currencies)
}

async function getOneCurrency(code) {
	const currencies = await redis.get('currencies')

	const currency = JSON.parse(currencies).find((c) => c.code === code)

	return currency
}

async function getRatesPair(from, to) {
	const cachedRates = await redis.get('currencies')
	const fromRate = JSON.parse(cachedRates).find((r) => r.code === from)
	const toRate = JSON.parse(cachedRates).find((r) => r.code === to)

	const exchangeRates = {
		from: fromRate,
		to: toRate
	}

	return exchangeRates
}

async function createCurrency(newCurrency) {
	const cachedCurrencies = await redis.get('currencies')

	const oldCurrencies = JSON.parse(cachedCurrencies)

	const newCurrencies = [...oldCurrencies, newCurrency]

	await redis.set('currencies', JSON.stringify(newCurrencies))
}

async function deleteCurrency(currency) {
	const currencies = await redis.get('currencies')

	const newCurrencies = JSON.parse(currencies).filter(
		(c) => c.code !== currency.code
	)

	await redis.set('currencies', JSON.stringify(newCurrencies))
}

export const currenciesRepository = {
	getRatesPair,
	getAllCurrencies,
	getOneCurrency,
	createCurrency,
	deleteCurrency
}
