const quotationController = require('../../src/controllers/quotation')
const quotationApi = require('../../src/api/quotation')
const coinModel = require('../../src/models/coin')
const mockingoose = require('mockingoose')
const mockValues = require('../../__mock__/controllers/quotation')

jest.useFakeTimers().setSystemTime(new Date('2022-11-21T23:00:00.000Z'))

quotationApi.getLastQuotation = jest.fn(() => {
	return mockValues.GET_LAST_QUOTATION_API_SUCCESS
})

test('It should update all API quotations', async () => {
	mockingoose(coinModel).toReturn(mockValues.DB_COIN_FIND, 'find')
	mockingoose(coinModel).toReturn(
		mockValues.DB_COIN_UPDATED,
		'findOneAndUpdate'
	)

	const response = await quotationController.updateApiQuotations()

	console.log(response.data)

	expect(response).toEqual(mockValues.SUCCESS_RESPONSE)
})
