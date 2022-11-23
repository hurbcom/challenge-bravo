exports.AWESOME_API_SUCCESS_RESPONSE = {
	BRLUSD: {
		code: 'BRL',
		codein: 'USD',
		name: 'Real Brasileiro/Dólar Americano',
		high: '0.1888',
		low: '0.1858',
		varBid: '0.0018',
		pctChange: '0.98',
		bid: '0.1875',
		ask: '0.1876',
		timestamp: '1669039772',
		create_date: '2022-11-21 11:09:32',
	},
}
exports.AWESOME_API_NOT_FOUND_RESPONSE = {
	status: 404,
	code: 'CoinNotExists',
	message: 'moeda nao encontrada BRL-BRL',
}

exports.LAST_QUOTATION_SUCCESS_RESPONSE = [
	{
		code: 'BRL',
		name: 'Real Brasileiro',
		quotation: { buy: '0.1875', sell: '0.1876' },
	},
]
