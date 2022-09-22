import { redis } from '../db.js'
const KEY = process.env.REDIS_KEY

async function getAllCurrencies() {
	const currencies = await redis.get(KEY)

	return JSON.parse(currencies)
}

async function getOneCurrency(code) {
	const currencies = await redis.get(KEY)

	const currency = JSON.parse(currencies).find((c) => c.code === code)

	return currency
}

async function getRatesPair(from, to) {
	const cachedRates = await redis.get(KEY)
	const fromRate = JSON.parse(cachedRates).find((r) => r.code === from)
	const toRate = JSON.parse(cachedRates).find((r) => r.code === to)

	const exchangeRates = {
		from: fromRate,
		to: toRate
	}

	return exchangeRates
}

async function createCurrency(newCurrency) {
	const cachedCurrencies = await redis.get(KEY)

	const oldCurrencies = JSON.parse(cachedCurrencies)

	const newCurrencies = [...oldCurrencies, newCurrency]

	await redis.set(KEY, JSON.stringify(newCurrencies))
}

async function deleteCurrency(currency) {
	const currencies = await redis.get(KEY)

	const newCurrencies = JSON.parse(currencies).filter(
		(c) => c.code !== currency.code
	)

	await redis.set(KEY, JSON.stringify(newCurrencies))
}

export const currenciesRepository = {
	getRatesPair,
	getAllCurrencies,
	getOneCurrency,
	createCurrency,
	deleteCurrency
}
