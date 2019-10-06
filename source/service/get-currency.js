'use strict'

const rp = require('request-promise');
const parseCurrency = require('../utils/currenty-utils').parseCurrency;

function getCurrency (params) {
    const source =  params.source;
    const currencies = params.currencies;
    const amount = params.amount;
    const options = {
        uri: 'http://apilayer.net/api/live?access_key='+ process.env.ACCESS_KEY + '&currencies=' + source + ',' + currencies + '&source=USD&format=1',
        resolveWithFullResponse: true,
        json: true,
        timeout: 30000
    };
    return rp(options)
        .then( function (result){
            return parseCurrency(result.body, source, currencies, amount);

        }).catch(function(err){
            return err.message;
        });
}



module.exports = getCurrency;