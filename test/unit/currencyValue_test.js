var expect = require('chai').expect;
var should = require('chai').should();
var assert = require('chai').assert;

const app = require('../../server.js');
const currencyValuesModel = app.models.currencyValuesModel;

describe('#currencValuesModel -> convertFromTo()', () => {
    
    it('fail add currency (lastro <> number)', () => {
        currencyValuesModel.addCurrency('HURB_Test', 'foo')
        .catch(currencyList => assert.isFalse(currencyList.success))
    });

    it('success add currency', () => {
        currencyValuesModel.addCurrency('HURB_Test', 123)
        .then(currencyList =>  assert.isTrue(currencyList.success))
        .catch(err=> console.log(err))
    });

    it('remove currency', () => {
        currencyValuesModel.removeCurrency('HURB_Test')
        .then(currencyList =>  assert.isTrue(currencyList.success))
        .catch(err=>console.log(err))
    });
});





