require('express');
const request = require("request"), cacheProvider = require('./cacheService').instance();

    exports.getCurenciesCoins  = function ( nameCurrency,keyName, to ){
    request('https://api.exchangeratesapi.io/latest?base=' + nameCurrency, function (error, response, body) {
        const currentRate = JSON.parse(body);
        const {rates} = currentRate;
        cacheProvider.set(keyName, to, rates[to]);
    })
}
