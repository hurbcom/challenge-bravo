const coinModel = require('../models/coin')

/**
 * Busca todas as moedas baseada na sua origem - API ou MANUAL
 * @param {string} origin Origeem da cotação [API ou MANUAL]
 * @returns {Promise<Array<Document>>} Array dos registros encontrados
 */
exports.findAllByOrigin = (origin) => {
	return coinModel
		.find({
			origin: origin,
		})
		.then((doc) => {
			return doc
		})
		.catch((err) => {
			console.log(
				`Não foi possível obter a lista de moedas por origem: ${err.message}`
			)
			throw err
		})
}

/**
 * Realiza a atualização das cotações de uma moeda
 * @param {Object} coin Objeto da Moeda contendo seu código e cotação
 * @returns {Promise<Document>} Resultado do update
 */
exports.updateCoinQuotation = (coin) => {
	const mongoQuery = { code: coin.code }
	const mongoUpdate = {
		quotation: {
			buy: coin.quotation.buy,
			sell: coin.quotation.sell,
		},
	}
	const mongoOptions = { new: true }

	return coinModel.findOneAndUpdate(mongoQuery, mongoUpdate, mongoOptions)
}
