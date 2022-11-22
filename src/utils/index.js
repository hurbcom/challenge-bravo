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
