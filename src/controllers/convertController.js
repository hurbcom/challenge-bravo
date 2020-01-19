let currencies = require('../services/currenciesService');
const formatCurrency = require('format-currency');
let cryptoCoins = ['BTC', 'ETH'];
let listOfCoins = ['USD', 'BRL', 'EUR'];

currenciesConvert = new currencies();
exports.get = async (req, res) => {
    let response;
    if (paramsFilters(req.query.from, req.query.amount, req.query.to)) {
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
    if (paramsFilters(req.params.from, req.params.amount, req.params.to)) {
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


const paramsFilters = function isRatesDateValid(from, amount, to) {
    if (
        (cryptoCoins.includes(from) || listOfCoins.includes(from))
        &&
        (cryptoCoins.includes(to) || listOfCoins.includes(to))
        && ValidateNumber(amount))
        return true;
    return false;
};

function ValidateNumber(strNumber) {
    var regExp = new RegExp("^\\d+(\\.\\d+)?$");
    var isValid = regExp.test(strNumber); // or just: /^\d+$/.test(strNumber);
    return isValid;
}
