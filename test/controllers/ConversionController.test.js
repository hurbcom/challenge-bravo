const ConversionController = require('../../src/controllers/ConversionController')

const assert = require('assert').strict;

describe('ConversionController', () => {
    const mock = {
        conversionService: { }
    }

    it('sanitize an amount', async () => {
        const conversionController = new ConversionController(mock);
        const result = await conversionController.sanitizeAmount("1000,00  ");
        assert.deepStrictEqual(result, 1000);
    })

    it('sanitize a currency key coin', async () => {
        const conversionController = new ConversionController(mock);
        const result = await conversionController.sanitizeCurrencyKey("GBP");
        assert.deepStrictEqual(result, "gbp");
    })
})