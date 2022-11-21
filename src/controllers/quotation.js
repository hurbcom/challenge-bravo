const models = require('../models')
const api = require('../api')
const repository = require('../repository')
const { BASE_COIN } = require('../properties')
const utils = require('../utils')

/**
 * Realiza a atualização online das cotações existentes no DB
 * @returns {Promise<Array<Document>>}
 * @author Vinícius Nunes
 */
exports.updateApiQuotations = () => {
	return repository.coin
		.findAllByOrigin('API')
		.then((docs) => {
			const listOfCoins = docs.map((coin) => `${coin.code}-${BASE_COIN}`)

			return api.quotation.getLastQuotation(listOfCoins)
		})
		.then((onlineQuotations) => {
			return Promise.all(
				onlineQuotations.map((quotation) => {
					return repository.coin.updateCoinQuotation(quotation)
				})
			)
		})
		.then((docsUpdated) => {
			console.log(
				`Update das cotações realizado com sucesso: ${docsUpdated.length} registros atualizados`
			)
			return utils.defaultResponse(
				200,
				'Atualização realizada com sucesso',
				docsUpdated
			)
		})
		.catch((err) => {
			throw err
		})
}
