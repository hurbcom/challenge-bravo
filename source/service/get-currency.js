'use strict'

const rp = require('request-promise');
const parseCurrency = require('../utils/currenty-utils').parseCurrency;
const env =  require('../config/env');
const accessKey =  process.env.ACCESS_KEY ? process.env.ACCESS_KEY : env.ACCESS_KEY;
const convertUrl = process.env.URI  ? process.env.CONVERTER_URL : 'http://apilayer.net/api/live';


function getCurrency (params) {
    const source =  params.source;
    const currencies = params.currencies;
    const amount = params.amount;
    const options = {
        uri: convertUrl+ '?access_key='+ accessKey + '&currencies=' + source + ',' + currencies + '&source=USD&format=1',
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