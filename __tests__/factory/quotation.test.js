const quotationFactory = require('../../src/factory/quotation')

test('It should convert a value with success', () => {
	const amount = quotationFactory.converterAmount(0.1866, 1, 25)

	expect(amount).toBe(4.665)
})
