const { DATABASE_URI } = require('../properties')
const mongoose = require('mongoose')

/**
 * Realiza a conexão com o banco de dados
 * @param {string} URI string de conexão com o banco
 * @returns {Promise} Mongoose Connection
 * @author Vinícius Nunes
 */
exports.start = (URI = DATABASE_URI) => {
	return mongoose
		.connect(URI, {
			useNewUrlParser: true,
		})
		.then((result) => {
			const { name, host } = result.connection
			console.log(
				`Conectado ao banco de dados com sucesso. Host: ${host} | Banco ${name}`
			)
			return result
		})
		.catch((err) => {
			console.log(`Não foi possível conectar ao banco de dados: ${err.message}`)
			throw err
		})
}
