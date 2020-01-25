let cryptoCoins = ['BTC', 'ETH'];
let listOfCoins = ['USD', 'BRL', 'EUR'];
require('../../services/cacheService').instance();
let numbersUtil = require("../../util/numbers");
let cacheProvider = require('../../services/cacheService').instance();

exports.paramsFilters = function (req) {
    let enableCurrency = cacheProvider.get("coins", 'valid');
    return (((cryptoCoins.includes(req.from)|| listOfCoins.includes(req.from))
            &&  enableCurrency.includes(req.from)) )
        &&
        ((cryptoCoins.includes(req.to) || listOfCoins.includes(req.to))  &&  enableCurrency.includes(req.to))
        && numbersUtil.validateNumber(req.amount);
};

exports.paramsFiltersCreate = function (currency) {
    return (cryptoCoins.includes(currency) || listOfCoins.includes(currency));
};
