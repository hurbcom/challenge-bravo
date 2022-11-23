class HandledError extends Error {
	/**
	 * Classe para gerenciar os erros customizados da aplicação
	 * @param {number} code Http Status Code do Erro
	 * @param {object} message Erro a ser repassado
	 * @author: Vinícius Nunes
	 */
	constructor(code, message) {
		super(message)
		this.error = true
		this.statusCode = code
		this.date = new Date()
	}

	showError() {
		return {
			error: this.error,
			statusCode: this.statusCode,
			date: this.date,
			message: this.message,
		}
	}
}

HandledError.prototype.name = 'HandledError'
module.exports = HandledError
