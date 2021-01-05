const config = require('../../config')
const axios = require('axios')

const makeRetrieveConversion = require('./currency/retrieveConversion');
const makeAddCurrency = require('./currency/addCurrency');
const makeRemoveCurrency = require('./currency/removeCurrency');

const retrieveConversion = makeRetrieveConversion({ config, axios })
const addCurrency = makeAddCurrency({})
const removeCurrency = makeRemoveCurrency({})


module.exports = {
    retrieveConversion,
    addCurrency,
    removeCurrency
}