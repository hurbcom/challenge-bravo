require('express');
const request = require("request"), cacheProvider = require('./cacheService').instance();

exports.getRate = function (from, to) {
    request(`https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`, function (error, response, body) {
        const currentRate = JSON.parse(body);
        Object.entries(currentRate).forEach(([key, value]) => {
            //86400000
            let currencies = Array.from(cacheProvider.get("coins", 'valid'));
            cacheProvider.delete("Rates", key.toString());
            cacheProvider.delete("Rates", "base");
            cacheProvider.set("Rates", 'base', from, 86400000);
            cacheProvider.set("Rates", key.toString(), value, 86400000);
            cacheProvider.set("coins", 'valid', currencies);
        });
    });
};

exports.delete = function (from, to) {
    let currencies = Array.from(cacheProvider.get("coins", 'valid'));
    currencies = removeArray(currencies, to);
    cacheProvider.set("coins", 'valid', currencies);
    cacheProvider.delete("Rates", to.toString());
}

let removeArray = function (array, to) {
    return array.filter(function (ele) {
        return ele != to;
    });
}