const HandledError = require('../../src/helpers/HandledError')

jest.useFakeTimers().setSystemTime(new Date('2022-11-21T23:00:00.000Z'))

test('It show a error', () => {
	try {
		throw new HandledError(503, 'Not Implemented')
	} catch (error) {
		expect(error.showError()).toMatchObject({
			date: new Date('2022-11-21T23:00:00.000Z'),
			error: true,
			message: 'Not Implemented',
			statusCode: 503,
		})
	}
})
