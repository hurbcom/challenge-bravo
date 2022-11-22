const utils = require('../../src/utils')

test('It should return a default response with error false and 2xx status code', (done) => {
	const response = utils.defaultResponse(200, 'Tudo certo', {
		message: 'Tudo certo',
	})

	expect(response.error).toEqual(false)
	expect(response.statusCode).toEqual(200)
	expect(response.message).toEqual('Tudo certo')
	done()
})

test('It should return a default response with error true and !2xx and !3xx status code', (done) => {
	const response = utils.defaultResponse(400, 'Bad Request', {
		message: 'Erro de validação',
	})

	expect(response.error).toEqual(true)
	expect(response.statusCode).toEqual(400)
	expect(response.message).toEqual('Bad Request')
	done()
})
