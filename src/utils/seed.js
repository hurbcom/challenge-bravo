import { redis } from '../db.js'
import axios from 'axios'

const BASE_URL = `https://exchange-rates.abstractapi.com/v1/live?api_key=${process.env.API_KEY}&base=USD&target=BRL,EUR,BTC,ETH`

export default async function seed() {
	const exchangeRates = await redis.get('rates')

	if (!exchangeRates) {
		const rates = await axios.get(`${BASE_URL}`).then((res) => [
			{ name: 'American Dollar', code: 'USD', rate: 1 },
			{
				name: 'Euro',
				code: 'EUR',
				rate: (1 / res.data.exchange_rates.EUR).toFixed(4)
			},
			{
				name: 'Brazilian Real',
				code: 'BRL',
				rate: (1 / res.data.exchange_rates.BRL).toFixed(4)
			},
			{
				name: 'Bitcoin',
				code: 'BTC',
				rate: (1 / res.data.exchange_rates.BTC).toFixed(4)
			},
			{
				name: 'Ethereum',
				code: 'ETH',
				rate: (1 / res.data.exchange_rates.ETH).toFixed(4)
			}
		])

		await redis.set('rates', JSON.stringify(rates), { EX: 60 * 60 })

		return rates
	}

	return JSON.parse(exchangeRates)
}
