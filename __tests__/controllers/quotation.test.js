const quotationController = require('../../src/controllers/quotation')
const quotationApi = require('../../src/api/quotation')
const currencyModel = require('../../src/models/currency')
const mockingoose = require('mockingoose')
const mockValues = require('../../__mock__/controllers/quotation')
const redis = require('../../src/redis')

jest.useFakeTimers().setSystemTime(new Date('2022-11-21T23:00:00.000Z'))

quotationApi.getLastQuotation = jest.fn(() => {
	return mockValues.GET_LAST_QUOTATION_API_SUCCESS
})

redis.getValue = jest.fn(() => {
	return true
})
redis.setValue = jest.fn(() => {
	return true
})
redis.removeValue = jest.fn(() => {
	return true
})

test('It should update all API quotations', async () => {
	mockingoose(currencyModel).toReturn(mockValues.DB_CURRENCY_FIND, 'find')
	mockingoose(currencyModel).toReturn(
		mockValues.DB_COIN_UPDATED,
		'findOneAndUpdate'
	)

	const response = await quotationController.updateApiQuotations()

	expect(response).toEqual(
		mockValues.DEFAULT_RESPONSE('Atualização realizada com sucesso', 201)
	)
})
