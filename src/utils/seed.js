import { redis } from '../db.js'
import axios from 'axios'

const BASE_URL = `https://exchange-rates.abstractapi.com/v1/live?api_key=${process.env.API_KEY}&base=USD&target=BRL,EUR,BTC,ETH`

export default async function seed() {
	const currencies = await redis.get('currencies')

	if (!currencies) {
		const currenciesRates = await axios.get(`${BASE_URL}`).then((res) => [
			{ name: 'American Dollar', code: 'USD', rate: 1, type: 'base' },
			{
				name: 'Euro',
				code: 'EUR',
				rate: +(1 / res.data.exchange_rates.EUR).toFixed(4),
				type: 'base'
			},
			{
				name: 'Brazilian Real',
				code: 'BRL',
				rate: +(1 / res.data.exchange_rates.BRL).toFixed(4),
				type: 'base'
			},
			{
				name: 'Bitcoin',
				code: 'BTC',
				rate: +(1 / res.data.exchange_rates.BTC).toFixed(4),
				type: 'base'
			},
			{
				name: 'Ethereum',
				code: 'ETH',
				rate: +(1 / res.data.exchange_rates.ETH).toFixed(4),
				type: 'base'
			}
		])

		await redis.set('currencies', JSON.stringify(currenciesRates), {
			EX: 60 * 60
		})

		return currenciesRates
	}

	return JSON.parse(currencies)
}
