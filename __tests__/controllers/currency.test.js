const currencyController = require('../../src/controllers/currency')
const mockingoose = require('mockingoose')
const currencyModel = require('../../src/models/currency')
const mockValues = require('../../__mock__/controllers/currency')
const redis = require('../../src/redis')
const HandledError = require('../../src/helpers/HandledError')

jest.useFakeTimers().setSystemTime(new Date('2022-11-21T23:00:00.000Z'))

redis.setValue = jest.fn(() => {
	return null
})
redis.removeValue = jest.fn(() => {
	return null
})

test('It should list all currencies', async () => {
	mockingoose(currencyModel).toReturn(mockValues.DB_CURRENCY_FIND, 'find')

	const response = await currencyController.listAllCurrencies()

	expect(response).toMatchObject(
		mockValues.DEFAULT_RESPONSE(mockValues.DB_CURRENCY_FIND, 200)
	)
})

test('It should add a new currency with success', async () => {
	mockingoose(currencyModel).toReturn(null, 'findOne')
	mockingoose(currencyModel).toReturn({}, 'save')
	const redisSpy = jest.spyOn(redis, 'setValue')

	const response = await currencyController.addCurrency(mockValues.ADD_CURRENCY)

	expect(response).toMatchObject(
		mockValues.DEFAULT_RESPONSE('Moeda cadastrada com sucesso', 201)
	)
	expect(redisSpy).toHaveBeenCalledTimes(1)
})

test('It should dont add a new currency', async () => {
	mockingoose(currencyModel).toReturn(mockValues.DB_CURRENCY_FIND, 'findOne')
	const redisSpy = jest.spyOn(redis, 'setValue')

	const response = await currencyController.addCurrency(mockValues.ADD_CURRENCY)

	expect(response).toMatchObject(
		mockValues.DEFAULT_RESPONSE('A Moeda já se encontra cadastrada', 200)
	)
	expect(redisSpy).not.toHaveBeenCalled()
})

test('It should update a existing currency with success', async () => {
	mockingoose(currencyModel).toReturn(
		mockValues.DB_CURRENCY_FIND,
		'findOneAndUpdate'
	)
	const redisSpy = jest.spyOn(redis, 'setValue')

	const response = await currencyController.updateCurrency(
		mockValues.ADD_CURRENCY
	)

	expect(response).toMatchObject(
		mockValues.DEFAULT_RESPONSE('Moeda atualizada com sucesso', 200)
	)
	expect(redisSpy).toHaveBeenCalledTimes(1)
})

test('It should get a error when try to update', async () => {
	mockingoose(currencyModel).toReturn(null, 'findOneAndUpdate')
	const redisSpy = jest.spyOn(redis, 'setValue')

	try {
		await currencyController.updateCurrency(mockValues.ADD_CURRENCY)
	} catch (err) {
		expect(err).toBeInstanceOf(HandledError)
		expect(redisSpy).not.toHaveBeenCalled()
	}
})

test('It should remove a existing currency with success', async () => {
	mockingoose(currencyModel).toReturn(
		mockValues.DB_CURRENCY_FIND,
		'findOneAndDelete'
	)
	const redisSpy = jest.spyOn(redis, 'removeValue')

	const response = await currencyController.removeCurrency(
		mockValues.ADD_CURRENCY
	)

	expect(response).toMatchObject(
		mockValues.DEFAULT_RESPONSE('Moeda removida com sucesso', 200)
	)
	expect(redisSpy).toHaveBeenCalledTimes(1)
})

test('It should dont found a currency when try to remove', async () => {
	mockingoose(currencyModel).toReturn(null, 'findOneAndDelete')
	const redisSpy = jest.spyOn(redis, 'removeValue')

	try {
		await currencyController.removeCurrency(mockValues.ADD_CURRENCY)
	} catch (err) {
		expect(err).toBeInstanceOf(HandledError)
		expect(redisSpy).not.toHaveBeenCalled()
	}
})
