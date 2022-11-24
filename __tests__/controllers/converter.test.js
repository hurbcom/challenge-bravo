const { before } = require('lodash')
const converterController = require('../../src/controllers/converter')
const HandledError = require('../../src/helpers/HandledError')
const redis = require('../../src/redis')
const mockValues = require('../../__mock__/controllers/converter')

redis.getValue = jest
	.fn()
	.mockImplementationOnce(() => mockValues.REDIS_GET_VALUE_FROM)
	.mockImplementationOnce(() => mockValues.REDIS_GET_VALUE_TO)

beforeAll(() => {})

describe('Tests of success', () => {
	test('It should convert a value with success', async () => {
		const params = {
			from: 'BRL',
			to: 'USD',
			amount: 50,
		}
		const redisSpy = jest.spyOn(redis, 'getValue')
		const response = await converterController.currencyConverter(params)

		expect(response.message.from).toBe('BRL')
		expect(response.message.to).toBe('USD')
		expect(response.message.amount).toBe(9.33)
		expect(redisSpy).toHaveBeenCalledTimes(2)
	})
})

describe('Tests of errors', () => {
	test('It should dont find a value in redis and throw a error', async () => {
		const params = {
			from: 'BRL',
			to: 'USD',
			amount: 50,
		}

		try {
			await converterController.currencyConverter(params)
		} catch (err) {
			expect(err).toBeInstanceOf(HandledError)
		}
		redis.getValue.mockReset()
	})
})
