const repository = require('../repository')
const { round, isEmpty } = require('lodash')
const HandledError = require('../helpers/HandledError')
const factory = require('../factory')
const { defaultResponse } = require('../utils')
const redis = require('../redis')

/**
 * Converte o valor origem para o valor destino
 * @param {object} queryParams Params -> FROM, TO, AMOUNT, TYPE?
 * @returns {object} Objeto de resposta padrão
 * @author Vinícius Nunes
 */
exports.currencyConverter = (queryParams) => {
	let { from, to, amount, type } = queryParams

	if (!type) type = 'sell'
	from = from.toUpperCase()
	to = to.toUpperCase()

	const currencyFrom = () => {
		return redis.getValue(from)
	}

	const currencyTo = () => {
		return redis.getValue(to)
	}

	return Promise.all([currencyFrom(), currencyTo()])
		.then((result) => {
			if (result[0] == null || result[1] == null) {
				throw new HandledError(
					404,
					'A combinação de moedas informadas não se encontram disponíveis para conversão'
				)
			}

			const dbFromAmount = JSON.parse(result[0])[type]
			const dbToAmount = JSON.parse(result[1])[type]

			const amountConverted = factory.quotation.converterAmount(
				dbFromAmount,
				dbToAmount,
				amount
			)

			const response = {
				from,
				to,
				amount: amountConverted,
			}

			return defaultResponse(200, response)
		})
		.catch((err) => {
			console.log(
				`Não foi possível realizar a conversão dos valores: ${err.message}`
			)
			throw err
		})
}
