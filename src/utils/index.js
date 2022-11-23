const { get } = require('lodash')

/**
 * Realiza a ppadronização de respposta para o cliente
 * @param {Number} statusCode Http Status Code
 * @param {Any} message Qualquer dado que queira ser repassado
 * @returns Objeto padrão de resposta para o cliente
 * @author Vinícius Nunes
 */
exports.defaultResponse = (statusCode, message) => {
	return {
		error: statusCode >= 200 && statusCode <= 399 ? false : true,
		date: new Date(),
		statusCode: statusCode,
		message: message,
	}
}

/**
 * Realiza uma verificação em todo objeto buscando
 * se existe a chave solicitada. Caso não encontre, retorna a chave
 * que está faltando
 * @param {object} payload Objeto origem para validar
 * @param {string[]} requireKeys Array com o nome dos campos a serem verificados
 * @returns {string[]} Array com os campos faltantes no payload
 * @author Vinícius Nunes
 */
exports.verifyKeysPayload = (payload, requireKeys) => {
	let emptyKeys = []

	for (const field of requireKeys) {
		const hasField = get(payload, field, undefined)

		if (!hasField) emptyKeys.push(field)
	}

	return emptyKeys
}
