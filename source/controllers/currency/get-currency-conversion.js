'use strict'

const getCurrencyService = require('../../service/get-currency');
const currentyUtils = require('../../utils/currenty-utils');


const getCurrencyConversion = (req, res ) => {
    currentyUtils.currencyValidate(req.query.from, req.query.to).then( function (valid) {
         if(!valid) {
             return res.status(400).send({result: "You have provided one or more currencies that are not in our database."});
         }else {
            const params = {
                'source':req.query.from,
                'currencies':req.query.to,
                'amount': req.query.amount
            }
            getCurrencyService(params).then(function (currency) {
                if(currency.statusCode === 400) {
                    return res.status(400).send(currency);
                }
                return res.status(200).send(currency);
            });
        }
    });
}




module.exports = getCurrencyConversion;