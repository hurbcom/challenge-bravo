const { isNumber, isNaN } = require('lodash')
const HandledError = require('../helpers/HandledError')

/**
 * Faz a verificação dos campos obrigatórios para
 * ser realizada a conversão da moeda
 * @param {object} params Objeto contendo FROM, TO, AMOUNT
 * @returns {void | Error} Lança erro em caso de falha na validação
 * @author Vinícius Nunes
 */
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
			`Os parâmetros a seguir devem ser enviados corretamente: ${paramsNotFound.join(
				', '
			)}`
		)
	}

	validateAmount(params.amount)
}

function validateAmount(amount) {
	if (isNaN(+amount)) {
		throw new HandledError(400, 'O parâmetro amount deve ser um número válido')
	}

	if (amount <= 0) {
		throw new HandledError(
			400,
			'O parâmetro amount deve ser um valor positivo acima de 0'
		)
	}
}
