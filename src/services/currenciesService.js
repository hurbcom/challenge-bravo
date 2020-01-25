require('express');
const request = require("request"), cacheProvider = require('./cacheService').instance();

exports.getRates = function (from, to) {
    request(`https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`, function (error, response, body) {
        const currentRate = JSON.parse(body);
        Object.entries(currentRate).forEach(([key, value]) => {
            cacheProvider.set("Rates", key.toString(), value);
        });
    });
};