const { isNaN } = require('lodash')
const HandledError = require('../helpers/HandledError')
const utils = require('../utils')

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

/**
 * Faz a validação do payload para cadastro de nova moeda
 * @param {object} payload Body contendo os dados da Moeda
 * @author Vinícius Nunes
 */
exports.validateAddCurrencyPaylaod = (payload) => {
	const expectedFields = [
		'code',
		'name',
		'quotation',
		'quotation.buy',
		'quotation.sell',
	]

	let fieldsNotFound = utils.verifyKeysPayload(payload, expectedFields)

	if (fieldsNotFound.length > 0) {
		throw new HandledError(
			400,
			`Os campos a seguir são obrigatórios: ${fieldsNotFound.join(', ')}`
		)
	}

	if (isNaN(+payload.quotation.sell) || isNaN(+payload.quotation.buy)) {
		throw new HandledError(
			400,
			'Os campos de valores devem conter números válidos'
		)
	}
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
