const quotationApi = require('../../src/api/quotation')
const mockValues = require('../../__mock__/api/quotation')
const nock = require('nock')
const {
	AWESOMEAPI_URI,
	AWESOMEAPI_ENDPOINT_LAST,
} = require('../../src/properties')

test('It should get the last quotation between 2 coins', async () => {
	const from = 'BRL'
	const to = 'USD'

	const concatened = `${from}-${to}`

	nock(AWESOMEAPI_URI)
		.get(`${AWESOMEAPI_ENDPOINT_LAST}/${concatened}`)
		.reply(200, mockValues.AWESOME_API_SUCCESS_RESPONSE)

	const response = await quotationApi.getLastQuotation([concatened])

	expect(response).toEqual(mockValues.LAST_QUOTATION_SUCCESS_RESPONSE)
})
