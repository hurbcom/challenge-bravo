var assert = require('chai').assert;

const app = require('../../server.js');
const cronUpdateCurrencyValuesModel = app.models.cronUpdateCurrencyValuesModel;

describe('#cronUpdateCurrencyValuesModel -> updateCryptoValues()', () => {
    
    it('success update cryptocoins value', () => {
        cronUpdateCurrencyValuesModel.updateCryptoValues()
        .catch(res =>assert.isTrue(res.success))
    });

    it('success update currency coins value', () => {
        cronUpdateCurrencyValuesModel.updateAll()
        .catch(res =>assert.isTrue(res.success))
    });
  
});





