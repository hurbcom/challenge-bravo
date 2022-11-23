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
	return repository.currency
		.findAllByOrigin('API')
		.then((result) => {
			let listOfCoins = result.map((coin) => `${coin.code}-${BASE_COIN}`)

			return api.quotation.getLastQuotation(listOfCoins)
		})
		.then((onlineQuotations) => {
			return Promise.all(
				onlineQuotations.map((quotation) => {
					let coin = {
						quotation: {
							buy: quotation.quotation.buy,
							sell: quotation.quotation.sell,
						},
					}
					return repository.currency.update(quotation.code, coin)
				})
			)
		})
		.then((docsUpdated) => {
			console.log(
				`Update das cotações realizado com sucesso: ${docsUpdated.length} registros atualizados`
			)

			return utils.defaultResponse(201, 'Atualização realizada com sucesso')
		})
		.catch((err) => {
			console.log(
				`Não foi possível realizar a atualização das cotações: ${err.message}`
			)
			throw err
		})
}
