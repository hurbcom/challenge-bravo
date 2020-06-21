var assert = require('chai').assert;

const app = require('../../server.js');
const currencyValuesModel = app.models.currencyValuesModel;

before(() => {
    require('./cronUpdateCurrencyValues_test');
  });


describe('#currencValuesModel', () => {
    
    it('fail add currency (lastro <> number)', () => {
        currencyValuesModel.addCurrency('HURB_Test', 'foo')
        .catch(currencyList => assert.isFalse(currencyList.success))
    });

    it('success add currency', () => {
        currencyValuesModel.removeCurrency('HURB_Test')
        .then(res => {
            currencyValuesModel.addCurrency('HURB_Test', 123)
            .then(currencyList =>  assert.isTrue(currencyList.success))
        })
        .catch(err=> console.log(err))
        
    });

    it('remove currency', () => {
        currencyValuesModel.removeCurrency('HURB_Test')
        .then(currencyList =>  assert.isTrue(currencyList.success))
    });
});





