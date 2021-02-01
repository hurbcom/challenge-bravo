const CurrencyController = require('../../src/controllers/CurrencyController')

const assert = require('assert').strict;

describe('CurrencyController', () => {
    const mock = {
        currencyService: { }
    }

    it('sanitize a currency key coin', async () => {
        const currencyController = new CurrencyController(mock);
        const result = await currencyController.sanitizeCurrencyKey("GBP");
        assert.deepStrictEqual(result, "gbp");
    });
    
})