const assert = require('assert');
const Converter = require('../api/services/converter');

const currencies = {
    "BRL": 4,
    "BTC": 0.2,
    "ETH": 0.7,
    "EUR": 1.5,
    "USD": 1
}

describe('API Service Converter', function() {

    describe('convertCurrencyToUSD', function() {
        const conversions = [
            { key: 'BRL', value: 10, converted:2.5},
            { key: 'BTC', value: 10, converted:50},
            { key: 'ETH', value: 10, converted:14.286},
            { key: 'EUR', value: 10, converted:6.667},
            { key: 'USD', value: 10, converted:10},
        ]

        for(let c of conversions){
            it(c.key, () => assert.equal(Converter.convertCurrencyToUSD(c.key,c.value,currencies), c.converted));
        }
    });
    
    describe('convertUSDToCurrency', function() {
        const conversions = [
            { key: 'BRL', value: 10, converted:40},
            { key: 'BTC', value: 10, converted:2},
            { key: 'ETH', value: 10, converted:7},
            { key: 'EUR', value: 10, converted:15},
            { key: 'USD', value: 10, converted:10},
        ]

        for(let c of conversions){
            it(c.key, () => assert.equal(Converter.convertUSDToCurrency(c.key,c.value,currencies), c.converted));
        }
    });

    describe('convertfromToCurrency', function() {
        const conversions = [
            { from: 'BRL', to:"USD", value: 10, converted:2.5},
            { from: 'EUR', to:"BTC", value: 10, converted:1.333},
            { from: 'ETH', to:"ETH", value: 10, converted:10.0},
            { from: 'BTC', to:"EUR", value: 10, converted:75.0},
            { from: 'USD', to:"USD", value: 10, converted:10},
        ]

        for(let c of conversions){
            it(`${c.from} -> ${c.to} `, () => assert.equal(Converter.convertfromToCurrency(c.from,c.to,c.value,currencies), c.converted));
        }
    });
  

});

