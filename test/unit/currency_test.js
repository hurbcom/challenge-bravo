var expect = require('chai').expect;
var should = require('chai').should();
var assert = require('chai').assert;

const app = require('../../server.js');
const currencyModel = app.models.currencyModel;

after(() => {
    require('./currencyValue_test');
  });

describe('#currencyModel -> toDolar()', () => {
    
    it('success converting BRL to USD (amount as number)', () => {
        let dolarValue = currencyModel.toDolar(10, 'BRL');
        assert.isTrue(dolarValue.success);
    });

    it('failure converting BRL to USD (amount as string)', () => {
        let dolarValue = currencyModel.toDolar('a', 'BRL');
        assert.isFalse(dolarValue.success);
    });

    it('failure converting Unknown currency to USD', () => {
        let dolarValue = currencyModel.toDolar(123, 'HURB');
        assert.isFalse(dolarValue.success);
    });
})

describe('#currencyModel -> toCurrency()', () => {
    
    it('success converting USD to BTC (amount as number)', () => {
        let dolarValue = currencyModel.toCurrency(10, 'BTC');
        assert.isTrue(dolarValue.success);
    });

    it('failure converting USD to BTC (amount <> number)', () => {
        let dolarValue = currencyModel.toCurrency('a', 'BTC');
        assert.isFalse(dolarValue.success);
    });

    it('failure converting from USD to Unknown currency', () => {
        let dolarValue = currencyModel.toCurrency(123, 'HURB');
        assert.isFalse(dolarValue.success);
    });
});

describe('#currencyModel -> convertFromTo()', () => {
    
    it('success converting BRL to EUR', () => {
        let dolarValue = currencyModel.convertFromTo('BRL', 'EUR', 1000);
        assert.isTrue(dolarValue.success);
    });

    it('failure converting BRL to EUR (amount <> number)', () => {
        let dolarValue = currencyModel.convertFromTo('BRL', 'EUR', 'a');
        assert.isFalse(dolarValue.success);
    });

    it('failure converting from any to Unknown currency', () => {
        let dolarValue = currencyModel.convertFromTo('BRL', 'HURB', 1000);
        assert.isFalse(dolarValue.success);
    });

    it('failure converting from Unknown to any currency', () => {
        let dolarValue = currencyModel.convertFromTo('HURB', 'BRL', 1000);
        assert.isFalse(dolarValue.success);
    });
});





