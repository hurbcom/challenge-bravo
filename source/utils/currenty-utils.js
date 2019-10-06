'use strict'

const Currency = require('../models/currency');

function parseCurrency(body, source, currencies, amount) {
    if( body.quotes['USD' + currencies] === undefined || body.quotes['USD' + source] === undefined) {

        const result = {
            statusCode: 400,
            result: "You have provided one or more invalid Currency Codes"
        }
        return result
    }
    const r = body.quotes['USD' + currencies] / body.quotes['USD' + source];

    const result = {
        'from' : source,
        'to' : currencies,
        'amount': amount,
        'result' : roundResult(r * amount )
    }
    return result;
}


function roundResult(r) {
    return r.toFixed(5);
}

async function currencyValidate(from, to) {
    let currencies = await Currency.find({});
    let result = currencies.filter((currency) => {
        console.log("filter",  currency.currencyName, from, to);
        return currency.currencyName === from || currency.currencyName === to;
    })
    console.log("RESULT", result.length);

    return result.length > 1;

}



module.exports = {parseCurrency, roundResult, currencyValidate}