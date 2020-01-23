require('express');
const request = require("request"), cacheProvider = require('./cacheService').instance();
var BigNumbers = require('big-numbers');

formatNumber = function (value){
    var numbers = new BigNumbers();
    var number = numbers.of(value);
    return numbers.format(number)
}

    exports.getCurenciesCoins  = function ( nameCurrency,keyName, to ){
    request('https://api.exchangeratesapi.io/latest?base=' + keyName, function (error, response, body) {
        const currentRate = JSON.parse(body);
        const {rates} = currentRate;
        cacheProvider.set("Rates", to, formatNumber(rates[to]));
    })
}
