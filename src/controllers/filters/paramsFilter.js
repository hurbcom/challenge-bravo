let cryptoCurrencies = ['BTC', 'ETH'];
let listOfCurrencies = ['USD', 'BRL', 'EUR'];
require('../../services/cacheService').instance();
let numbersUtil = require("../../util/numbers");
let cacheProvider = require('../../services/cacheService').instance();

exports.paramsFilters = function (req) {
    let enableCurrency = cacheProvider.get("currencies", 'valid');
    return (((cryptoCurrencies.includes(req.from)|| listOfCurrencies.includes(req.from))
            &&  enableCurrency.includes(req.from)) )
        &&
        ((cryptoCurrencies.includes(req.to) || listOfCurrencies.includes(req.to))  &&  enableCurrency.includes(req.to))
        && numbersUtil.validateNumber(req.amount) && req.from.toString().toLocaleLowerCase() != "base"  && req.from.toString().toLocaleLowerCase() != "base" ;
};

exports.paramsFiltersCreate = function (currency) {
    return (
        (cryptoCurrencies.includes(currency) || listOfCurrencies.includes(currency)
            && currency.toString().toLocaleLowerCase() != "base" ))
};
