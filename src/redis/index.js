const { createClient } = require('redis')
const { REDIS_URI } = require('../properties')

const client = createClient({
	url: REDIS_URI,
})

exports.start = () => {
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

exports.setValue = (key, value) => {
	return client.set(key, JSON.stringify(value))
}

exports.removeValue = (key) => {
	return client.del(key)
}

exports.getValue = (key) => {
	return client.get(key)
}
