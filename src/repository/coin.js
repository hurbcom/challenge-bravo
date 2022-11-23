const coinModel = require('../models/coin')
const { Document } = require('mongoose')

/**
 * Busca todas as moedas baseada na sua origem - API ou MANUAL
 * @param {string} origin Origeem da cotação [API ou MANUAL]
 * @returns {Promise<Document[]>} Array dos registros encontrados
 */
exports.findAllByOrigin = (origin) => {
	const mongoQuery = {
		origin: origin,
	}
	const mongoOptions = { lean: true }

	return coinModel
		.find(mongoOptions, {}, mongoOptions)
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
 * Busca todas as moedas no banco
 * @param {string} fields Campos a serem selecionados. Ex.: 'code name quotation'
 * @returns {Promise<Document[]>} Array dos registros encontrados
 * @author Vinícius Nunes
 */
exports.listAll = (fields) => {
	const mongoOptions = { lean: true }

	return coinModel.find({}, fields, mongoOptions)
}

/**
 * Salva um novo registro no banco de dados
 * @param {object} coin Modelo esperado para ser salvo no DB
 * @returns {Promise<Document>}
 * @author Vinícius Nunes
 */
exports.save = (coin) => {
	return new coinModel(coin).save()
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
