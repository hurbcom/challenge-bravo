const repository = require('../repository')
const factory = require('../factory')
const { defaultResponse } = require('../utils')

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
