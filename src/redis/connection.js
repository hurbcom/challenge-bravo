const { createClient } = require('redis')
const { REDIS_URI } = require('../properties')

exports.start = (URI = REDIS_URI) => {
	const client = createClient({
		url: URI,
	})

	return client
		.connect()
		.then((result) => {
			console.log('Conectado ao Redis com sucesso')
			return result
		})
		.catch((err) => {
			console.log(`Não foi possível se conectar ao Redis: ${err.message}`)
			throw err
		})
}
