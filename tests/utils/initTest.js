import { redis } from '../../src/db.js'

export async function initTest() {
	await redis.connect()
	
	const currenciesTest = [
		{
			name: 'American Dollar',
			code: 'USD',
			rate: 1,
			type: 'base'
		},
		{
			name: 'Euro',
			code: 'EUR',
			rate: 1,
			type: 'base'
		},
		{
			name: 'Brazilian Real',
			code: 'BRL',
			rate: 0.2,
			type: 'base'
		},
		{
			name: 'Bitcoin',
			code: 'BTC',
			rate: 20,
			type: 'base'
		},
		{
			name: 'Ethereum',
			code: 'ETH',
			rate: 10,
			type: 'base'
		}
	]

    await redis.set('currencies-test', JSON.stringify(currenciesTest))

	return currenciesTest
}
