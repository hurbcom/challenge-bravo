exports.DB_CURRENCY_FIND = [
	{
		name: 'Real Brasileiro',
		code: 'BRL',
		quotation: {
			buy: 0.1877,
			sell: 0.1877,
		},
		origin: 'API',
		updatedAt: new Date('2022-11-21T23:00:00.000Z'),
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

exports.ADD_CURRENCY = {
	code: 'AUD',
	name: 'Dólar Australiano',
	quotation: {
		buy: 0.6678,
		sell: 0.6688,
	},
}
