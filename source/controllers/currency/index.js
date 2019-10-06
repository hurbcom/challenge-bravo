'use strict';

const healthcheck = require('./healthcheck');
const getCurrencyConversion = require('./get-currency-conversion');
const getAllCurrencies = require('./get-all-currencies');
const getCurrency = require('./get-currency');
const postCurrency = require('./post-currency');
const updateCurrency = require('./update-currency');
const deleteCurrency = require('./delete-currency')

module.exports = {
    healthcheck,
    getCurrencyConversion,
    getAllCurrencies,
    getCurrency,
    postCurrency,
    updateCurrency,
    deleteCurrency
};