const axios = require('axios')
const { AWESOMEAPI_URI, AWESOMEAPI_ENDPOINT_LAST } = require('../properties')

/**
 * Busca a ultima cotação entre as moedas de origem e destino
 * @param {array} coins Lista de moedas no modelo [FROM-TO]
 * @returns {Promise<object>} Valores referente as moedas
 * @author Vinícius Nunes
 */
exports.getLastQuotation = (coins) => {
	const params = {
		method: 'GET',
		url: `${AWESOMEAPI_URI}${AWESOMEAPI_ENDPOINT_LAST}/${coins.join(',')}`,
	}

	return axios(params)
		.then((res) => {
			const data = res.data

			const quotations = coins.map((coin) => {
				coin = coin.replace('-', '')
				return {
					name: data[coin].name.split('/')[0],
					code: data[coin].code,
					quotation: {
						buy: data[coin].bid,
						sell: data[coin].ask,
					},
				}
			})

			return quotations
		})
		.catch((err) => {
			console.log(`Erro ao obter a cotação: ${err.response.data.message}`)
			throw err
		})
}
