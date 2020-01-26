require('express');
const request = require("request"), cacheProvider = require('./cacheService').instance();

exports.getRate = function (from, to) {

    request(`https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`, function (error, response, body) {
        try {
            const currentRate = JSON.parse(body);
            let currencies = Array.from(cacheProvider.get("currencies", 'valid'));
            Object.entries(currentRate).forEach(([key, value]) => {
                cacheProvider.delete("Rates", key.toString());
                cacheProvider.delete("Rates", "base");
                cacheProvider.set("Rates", 'base', from, 86400000);
                cacheProvider.set("Rates", key.toString(), value, 86400000);
            });
            cacheProvider.set("currencies", 'valid', currencies);
        } catch (e) {
            console.info("Error to loading datas")
        }

    });
};


exports.addRate = function (from, to) {
    request(`https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`, function (error, response, body) {
        try {
            const currentRate = JSON.parse(body);
            let currencies = Array.from(cacheProvider.get("currencies", 'valid'));
            Object.entries(currentRate).forEach(([key, value]) => {
                cacheProvider.delete("Rates", key.toString());
                cacheProvider.delete("Rates", "base");
                cacheProvider.set("Rates", 'base', from, 86400000);
                cacheProvider.set("Rates", key.toString(), value, 86400000);
                currencies.push(key.toString());
            });
            cacheProvider.set("currencies", 'valid', currencies);
        } catch (e) {
            console.info("Error to loading datas")
        }
    });

};


exports.delete = function (from, to) {
    let currencies = Array.from(cacheProvider.get("currencies", 'valid'));
    currencies = removeArray(currencies, to);
    cacheProvider.set("currencies", 'valid', currencies);
    cacheProvider.delete("Rates", to.toString());
};

let removeArray = function (array, to) {
    return array.filter(function (ele) {
        return ele !== to;
    });
};