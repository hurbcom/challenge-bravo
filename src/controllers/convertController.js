let currencies = require('../services/currenciesService');
const formatCurrency = require('format-currency');

let cryptoCoins = ['BTC', 'ETH'];
let listOfCoins = ['USD', 'BRL', 'EUR'];
const cacheProvider = require('../services/cacheService').instance();
var BigNumbers = require('big-numbers');

currenciesConvert = new currencies();

exports.get = async (req, res, next) => {
    try {
        let from = req.query.from.toUpperCase() , to = req.query.to.toUpperCase(), amount = req.query.amount;
            if (paramsFilters(req.query)) {
            var valueconvert = await currenciesConvert.getConversionCurrencies(from, to, amount);
            const response = await setResponse(
                from,
                amount,
                to,
                await valueconvert
            );
            res.status(200).json(response);
        } else {
            res.status(400).json({error: 'Something failed!'});
        }
    } catch (err) {
        next(err);
    }
};

exports.getfriendly = ('/:from/:to/:amount', async function (req, res, next) {
    try {
        let from = req.params.from.toUpperCase(), to = req.params.to.toUpperCase(), amount = req.params.amount;
        if (paramsFilters(req.params)) {
            var valueconvert = await currenciesConvert.getConversionCurrencies(from, to, amount);
            const response = await setResponse(
                from,
                amount,
                to,
                await valueconvert
            );
            res.status(200).json(response);
        } else {
            res.status(400).json({error: 'Something failed!'});
        }
    } catch (err) {
        next(err);
    }
});


const setResponse = async function setResponse(origin, amount, destiny, amountResult) {
        return {
            original: {
                currency: origin,
                    amount:     formatCurrency(amount, {minimumFractionDigits: 2})
            },
            result: {
                currency: destiny,
                    amount: formatCurrency(formatNumber(amountResult), {maxSignificant: 3})
            }
        };
};

//const setResponse = async (origin, amount, destiny, amountResult) => ();


const formatNumber = function (value){
    var numbers = new BigNumbers();
    var number = numbers.of(value);
    return numbers.format(number)
}

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
