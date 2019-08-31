const axios = require('axios')
var fs = require('fs');
var currencyModel = require('../models/currency.model.js')


exports.get = async (req, res, next) => {
    await currencyModel.getCurrency(req, res, next)
};

exports.getByCode = async (req, res, next) => {
    await currencyModel.getCurrencyByCode(req, res, next)
};

exports.post = async (req, res, next) => {    
    const url = `https://min-api.cryptocompare.com/data/price?&tsyms=${req.body.code}&fsym=USD`
    
    axios.get(url).then(async response => {   
        if (await response.data.hasOwnProperty(req.body.code)) {
            await currencyModel.addCurrency(req, res, next)
        } else {
            await res.send({ status: 'failure', result: 'Currency code is not valid' })
        }
    })  
};

exports.delete = async (req, res, next) => {
    await currencyModel.removeCurrency(req, res, next)
};