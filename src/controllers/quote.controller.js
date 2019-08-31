const axios = require('axios')
var fs = require('fs');
var quoteModel = require('../models/quote.model.js')


exports.get = async (req, res, next) => {
    if (req.query.length == 0) return res.send({ status: 'failure', result: 'Request must be "?from=USD&to=BRL&amount=1" for example' })

    const url = `https://min-api.cryptocompare.com/data/price?&tsyms=${req.query.to}&fsym=${req.query.from}`
    
    axios.get(url).then(async response => {   
        if (await response.data.hasOwnProperty(req.query.to)) {
            await quoteModel.getQuotation(req, res, response, next)
        } else {
            await res.send({ status: 'failure', result: 'Request must be "?from=USD&to=BRL&amount=1" for example' })
        }
    })      
};