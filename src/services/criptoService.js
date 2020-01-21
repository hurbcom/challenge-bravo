require('express');
const request = require("request"), cacheProvider = require('./cacheService').instance();

exports.getCriptoCoin  = function (from, to){
    request(`https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`, function (error, response, body) {
        const currentRate = JSON.parse(body);
        Object.entries(currentRate).forEach(([, value]) => {
            cacheProvider.set(from, to, value);
        });
    });
}