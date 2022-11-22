const { isNumber } = require('lodash')
const HandledError = require('../helpers/HandledError')

exports.validateQueryParamsToConverter = (params) => {
	const expectedParams = ['from', 'to', 'amount']

	let paramsNotFound = []

	for (const param of expectedParams) {
		const hasParam = params[param] ? true : false

		if (!hasParam) paramsNotFound.push(param)
	}

	if (paramsNotFound.length > 0) {
		throw new HandledError(
			400,
			`Os parâmetros devem ser enviados: ${paramsNotFound.join(', ')}`
		)
	}

	validateAmount(params.amount)

	if (!isNumber(parseInt(params.amount))) {
		throw new HandledError(400, 'O parâmetro amount deve ser um número válido')
	}

	if (params.amount <= 0) {
		throw new HandledError(
			400,
			'O parâmetro amount deve conter um valor acima de 0'
		)
	}
}

function validateAmount(amount) {
	if (!isNumber(parseInt(amount))) {
		throw new HandledError(400, 'O parâmetro amount deve ser um número válido')
	}

	if (amount <= 0) {
		throw new HandledError(
			400,
			'O parâmetro amount deve conter um valor acima de 0'
		)
	}

	if (amount.includes(',')) {
		throw new HandledError(
			400,
			'O parâmetro amount deve seguir o padrão com ponto. Ex.: 59.9'
		)
	}
}
