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

exports.findOne = (code) => {
	const mongoQuery = {
		code: code,
	}

	return coinModel.findOne(mongoQuery)
}

/**
 * Realiza o update da Moeda
 * @param {string} coinCode Código da moeda - BRL - BTC ..
 * @param {object} coin Campos a serem atualizados
 * @returns {Promise<Document>} Resultado do update
 * @author Vinícius Nunes
 */
exports.update = (coinCode, coin) => {
	const mongoQuery = { code: coinCode }
	const mongoOptions = { new: true }

	return coinModel.findOneAndUpdate(mongoQuery, coin, mongoOptions)
}
