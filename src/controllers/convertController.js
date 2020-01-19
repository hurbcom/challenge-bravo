let currencies = require('../services/currenciesService');
const formatCurrency = require('format-currency');
require('../services/cacheService').instance();

let cryptoCoins = ['BTC', 'ETH'];
let listOfCoins = ['USD', 'BRL', 'EUR'];

currenciesConvert = new currencies();
exports.get = async (req, res) => {
    let response;
    if (paramsFilters(req.query)) {
        response = setResponse(
            req.query.from,
            req.query.amount,
            req.query.to,
            currenciesConvert.getConversionCurrencies(req.query.from, req.query.to)
        );
        await res.send(response);
    } else {
        res.status(500).send({error: 'Something failed!'});
    }

};

exports.getfriendly = ('/:from/:to/:amount', async function (req, res) {
    let response;
    if (paramsFilters(req.params)) {
        response = setResponse(
            req.params.from,
            req.params.amount,
            req.params.to,
            currenciesConvert.getConversionCurrencies(req.params.from, req.params.to)
        );
        await res.send(response);
    } else {
        res.status(500).send({error: 'Something failed!'});
    }
});


const setResponse = (origin, amount, destiny, amountResult) => ({
    original: {
        currency: origin,
        amount: formatCurrency(amount)
    },
    result: {
        currency: destiny,
        amount: formatCurrency((amountResult * amount), {maxSignificant: 2})
    }
});


const paramsFilters = function isRatesDateValid(req) {
    return (cryptoCoins.includes(req.from) || listOfCoins.includes(req.from))
        &&
        (cryptoCoins.includes(req.to) || listOfCoins.includes(req.to))
        && ValidateNumber(req.amount);

};

/**
 * @return {boolean}
 */
function ValidateNumber(strNumber) {
    const regExp = new RegExp("^\\d+(\\.\\d+)?$");
    return regExp.test(strNumber); // or just: /^\d+$/.test(strNumber);
}
