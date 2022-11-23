const repository = require('../repository')
const { round, isEmpty } = require('lodash')
const HandledError = require('../helpers/HandledError')
const factory = require('../factory')
const { defaultResponse } = require('../utils')

exports.currencyConverter = (queryParams) => {
	let { from, to, amount, type } = queryParams

	if (!type) type = 'sell'
	from = from.toUpperCase()
	to = to.toUpperCase()

	const currencyFrom = () => {
		return repository.currency.findOne(from)
	}

	const currencyTo = () => {
		return repository.currency.findOne(to)
	}

	return Promise.all([currencyFrom(), currencyTo()])
		.then((docs) => {
			if (docs[0] == null || docs[1] == null) {
				throw new HandledError(
					404,
					'A combinação de moedas informadas não se encontram disponíveis para conversão'
				)
			}

			const dbFromAmount = docs[0].quotation[type]
			const dbToAmount = docs[1].quotation[type]

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
			throw err
		})
}
