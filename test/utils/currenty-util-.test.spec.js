const assert = require('assert');
const currentUtils = require('../../source/utils/currenty-utils');
const response = { statusCode: 400,
    result: 'You have provided one or more invalid Currency Codes' }


describe('currenty-utils.js', () => {
    it('parse currency', () => {
        assert.deepEqual(currentUtils.parseCurrency({'quotes':'USDBRL'}, '', 'EUR',1),response
            );
    })
});

describe('currenty-utils.js', () => {

    let response = null;
    currentUtils.currencyValidate('BLR','EUR').then(rsp => {
        response = rsp;
    });
    it('Currency validate', () => {

       assert.equal(response,null)

    });
});

describe('currenty-utils.js', () => {
    it('Round money', () => {
        assert.equal(currentUtils.roundResult(100.2345666), 100.23457);
    });
});