const models = require('../models')
const api = require('../api')
const repository = require('../repository')
const { isEmpty } = require('lodash')
const { COINS, BASE_COIN } = require('../properties')
const redis = require('../redis')

/**
 * Script que realiza a primeira carga no
 * banco de dados ao iniciar a aplicação.
 * Caso encontre dados, nada é feito
 * @param {array} coins Moedas bases da API para conversão
 * @param {string} baseCoin Moeda base de conversão
 * @returns {Promise<void>}
 * @author Vinícius Nunes
 */
exports.initializeQuotationsInDB = (coins = COINS, baseCoin = BASE_COIN) => {
	return repository.currency
		.findAllByOrigin('API')
		.then(async (result) => {
			if (isEmpty(result)) {
				console.log(
					`Nenhum registro encontrado. Iniciando a primeira carga das cotações via API: ${coins.join(
						', '
					)} com a moeda base: ${baseCoin}`
				)

				coins = coins.map((coin) => `${coin}-${baseCoin}`)
				const quotations = await api.quotation.getLastQuotation(coins)

				for (let currency of quotations) {
					new models.currency({ ...currency, origin: 'API' }).save()
					redis.setValue(currency.code, currency.quotation)
				}

				const usd = {
					name: 'Dólar Americano',
					code: 'USD',
					quotation: {
						buy: 1,
						sell: 1,
					},
					origin: 'MANUAL',
				}

				new models.currency(usd).save()
				redis.setValue(usd.code, usd.quotation)

				console.log('Primeira carga de cotações executada com sucesso')
			}
		})
		.catch((err) => {
			console.log(
				`Não foi possível realizar a primeira carga do banco de dados: ${err.message}`
			)
			throw err
		})
}
