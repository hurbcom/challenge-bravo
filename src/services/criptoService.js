require('express');
const request = require("request"), cacheProvider = require('./cacheService').instance();
var BigNumbers = require('big-numbers');

formatNumber = function (value){
    var numbers = new BigNumbers();
    var number = numbers.of(value);
    return numbers.format(number)
}


exports.getCriptoCoin  = function (from, to){
    request(`https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`, function (error, response, body) {
        const currentRate = JSON.parse(body);
        Object.entries(currentRate).forEach(([, value]) => {
            cacheProvider.set("Rates", to.toString(), formatNumber(value));
        });
    });
}