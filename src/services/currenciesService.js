require('express');
const request = require("request"), cacheProvider = require('./cacheService').instance();

function populateMemory(key, from, value) {
    let currencies = Array.from(cacheProvider.get("currencies", 'valid'));
    let newCUrrency = currencies.filter(function (ele) {
        return (ele !== key.toString());
    });

    cacheProvider.delete("Rates", key.toString());
    cacheProvider.delete("Rates", "base");
    cacheProvider.set("Rates", 'base', from, 86400000);
    cacheProvider.set("Rates", key.toString(), value, 86400000);
    cacheProvider.set("currencies", 'valid', currencies);
    if(newCUrrency){
        currencies.push(key.toString());
    }
}

function extractedDatas(body, from) {
    const currentRate = JSON.parse(body);
    Object.entries(currentRate).forEach(([key, value]) => {
        populateMemory(key, from, value);
    });
}

exports.addRate = function (from, to) {
    let url =  `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`;
    request(url, function (error, response, body) {
        try {
            extractedDatas(body, from);
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
    console.log(cacheProvider.get("currencies", 'valid'))
};

let removeArray = function (array, to) {
    return array.filter(function (ele) {
        return ele !== to;
    });
};