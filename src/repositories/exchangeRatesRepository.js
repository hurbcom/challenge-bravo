import { redis } from '../db.js'

async function getRatesPair(from, to) {
	const cachedRates = await redis.get('rates')
	const fromRate = JSON.parse(cachedRates).find(r => r.name === from)
    const toRate = JSON.parse(cachedRates).find(r => r.name === to)

    const exchangeRates = {
        from: fromRate,
        to: toRate
    }

    return exchangeRates
}

export const exchangeRatesRepository = {
    getRatesPair
}
