exports.DB_CURRENCY_FIND = [
	{
		_id: '637bb3e5136e0856ef14caf0',
		name: 'Real Brasileiro',
		code: 'BRL',
		quotation: {
			buy: 0.1877,
			sell: 0.1877,
		},
		origin: 'API',
		updatedAt: new Date('2022-11-21T23:00:00.000Z'),
		__v: 0,
	},
]

exports.DB_COIN_UPDATED = {
	_id: '637bb3e5136e0856ef14caf0',
	name: 'Real Brasileiro',
	code: 'BRL',
	quotation: {
		buy: 0.1875,
		sell: 0.1876,
	},
	origin: 'API',
	updatedAt: new Date('2022-11-21T23:00:00.000Z'),
	__v: 0,
}

exports.GET_LAST_QUOTATION_API_SUCCESS = [
	{
		code: 'BRL',
		name: 'Real Brasileiro',
		quotation: { buy: '0.1875', sell: '0.1876' },
	},
]

exports.DEFAULT_RESPONSE = (message, statuscode = 200, error = false) => {
	return {
		error: error,
		date: new Date('2022-11-21T23:00:00.000Z'),
		statusCode: statuscode,
		message: message,
	}
}
