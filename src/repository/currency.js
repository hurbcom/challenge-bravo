const Currency = require('../models/currency')
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

	return Currency.find(mongoQuery, {}, mongoOptions)
}

/**
 * Localiza o registro pelo código da moeda
 * @param {string} code Código da Moeda
 * @returns {Promise<Document>} Document do mongo
 * @author Vinícius Nunes
 */
exports.findOne = (code) => {
	const mongoQuery = {
		code: code,
	}

	return Currency.findOne(mongoQuery)
}

/**
 * Busca todas as moedas no banco
 * @param {object | string} projection Campos a serem selecionados. Ex.: {code: 1, __id: 0} ou 'code name quotation'
 * @returns {Promise<Document[]>} Array dos registros encontrados
 * @author Vinícius Nunes
 */
exports.listAll = (projection) => {
	const mongoOptions = { lean: true }

	return Currency.find({}, projection, mongoOptions)
}

/**
 * Salva um novo registro no banco de dados
 * @param {object} coin Modelo esperado para ser salvo no DB
 * @returns {Promise<Document>} Document do mongo
 * @author Vinícius Nunes
 */
exports.save = (coin) => {
	return new Currency(coin).save()
}

/**
 * Realiza o update da Moeda
 * @param {string} code Código da moeda - BRL - BTC ..
 * @param {object} currency Campos a serem atualizados
 * @returns {Promise<Document>} Document do mongo
 * @author Vinícius Nunes
 */
exports.update = (code, currency) => {
	const mongoQuery = { code: code }
	const mongoOptions = { new: true }

	return Currency.findOneAndUpdate(mongoQuery, currency, mongoOptions)
}

/**
 * Remove o registro do banco de dados
 * @param {string} code Código da Moeda
 * @param {object} query Query String para fazer o filtro
 * @returns {Promise<Document>} Document do mongo
 * @author Vinícius Nunes
 */
exports.remove = (code, query = {}) => {
	const mongoQuery = {
		...query,
		code: code,
	}

	return Currency.findOneAndDelete(mongoQuery)
}
