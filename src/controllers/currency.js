const repository = require('../repository')
const factory = require('../factory')
const { defaultResponse } = require('../utils')
const { isEmpty } = require('lodash')

/**
 * Busca todas as Moedas existentes no Banco de Dados
 * @returns {Object} Objeto de resposta padrão com a lista de Moedas
 * @author Vinícius Nunes
 */
exports.listAllCurrencies = () => {
	return repository.coin
		.listAll('code')
		.then((docs) => {
			const currencyCodes = factory.currency.formatCurrencyCodesToResponse(docs)

			return defaultResponse(200, currencyCodes)
		})
		.catch((err) => {
			console.log(`Não foi possível obter a lista de Moedas: ${err.message}`)
			throw err
		})
}

/**
 * Salva uma nova moeda no banco de dados
 * @param {object} payload Payload que contem a Moeda a ser cadastrada
 * @returns {object} Objeto de resposta padrão
 */
exports.addCurrency = (payload) => {
	return repository.coin
		.findOne(payload.code)
		.then(async (doc) => {
			if (!isEmpty(doc)) {
				return defaultResponse(200, 'A Moeda já se encontra cadastrada')
			}

			payload.code = payload.code.toUpperCase()

			await repository.coin.save(payload)

			return defaultResponse(201, 'Moeda cadastrada com sucesso')
		})
		.catch((err) => {
			throw err
		})
}
