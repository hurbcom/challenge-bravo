let cryptoCoins = ['BTC', 'ETH'];
let listOfCoins = ['USD', 'BRL', 'EUR'];
require('../../services/cacheService').instance();
let numbersUtil = require("../../util/numbers");

exports.paramsFilters = function (req) {
    return (cryptoCoins.includes(req.from) || listOfCoins.includes(req.from))
        &&
        (cryptoCoins.includes(req.to) || listOfCoins.includes(req.to))
        && numbersUtil.validateNumber(req.amount);
};

exports.paramsFiltersCreate = function (currency) {
    return (cryptoCoins.includes(currency) || listOfCoins.includes(currency));
};

exports.paramsFilters = function (array) {
    array.filter(function (ele) {
        return ele == to;
    })
};