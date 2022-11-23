const repository = require('../repository')
const factory = require('../factory')
const { defaultResponse } = require('../utils')
const { isEmpty } = require('lodash')
const HandledError = require('../helpers/HandledError')

/**
 * Busca todas as Moedas existentes no Banco de Dados
 * @returns {Object} Objeto de resposta padrão com a lista de Moedas
 * @author Vinícius Nunes
 */
exports.listAllCurrencies = () => {
	const projection = {
		_id: 0,
		code: 1,
		name: 1,
		quotation: 1,
		updatedAt: 1,
		createdAt: 1,
	}

	return repository.currency
		.listAll(projection)
		.then((docs) => {
			return defaultResponse(200, docs)
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
	return repository.currency
		.findOne(payload.code)
		.then(async (doc) => {
			if (!isEmpty(doc)) {
				return defaultResponse(200, 'A Moeda já se encontra cadastrada')
			}

			payload.code = payload.code.toUpperCase()

			await repository.currency.save(payload)

			return defaultResponse(201, 'Moeda cadastrada com sucesso')
		})
		.catch((err) => {
			throw err
		})
}

exports.updateCurrency = (code, payload) => {
	return repository.currency
		.update(code, payload)
		.then((result) => {
			if (isEmpty(result)) {
				throw new HandledError(404, 'Moeda não encontrada')
			}

			return defaultResponse(200, 'Moeda atualizada com sucesso')
		})
		.catch((err) => {
			throw err
		})
}

exports.removeCurrency = (code) => {
	return repository.currency
		.remove(code, { origin: 'MANUAL' })
		.then((result) => {
			if (isEmpty(result)) {
				throw new HandledError(404, 'Moeda não encontrada')
			}

			return defaultResponse(200, 'Moeda removida com sucesso')
		})
		.catch((err) => {
			throw err
		})
}
