import { redis } from '../db.js'

async function getAllCurrencies() {
	const currencies = await redis.get('rates')

	return JSON.parse(currencies)
}

async function getRatesPair(from, to) {
	const cachedRates = await redis.get('rates')
	const fromRate = JSON.parse(cachedRates).find((r) => r.code === from)
	const toRate = JSON.parse(cachedRates).find((r) => r.code === to)

	const exchangeRates = {
		from: fromRate,
		to: toRate
	}

	return exchangeRates
}

async function createCurrency(newCurrency) {
	const cachedCurrencies = await redis.get('rates')

	const oldCurrencies = JSON.parse(cachedCurrencies)

	const newCurrencies = [...oldCurrencies, newCurrency]

	await redis.set('rates', JSON.stringify(newCurrencies))
}

export const exchangeRatesRepository = {
	getRatesPair,
	getAllCurrencies,
	createCurrency
}
