'use strict';


const currency = require('../controllers/currency/');

module.exports = function(app) {

    app.get('/api/healthcheck',currency.healthcheck);

    app.get('/api/conversion', currency.getCurrencyConversion);

    app.get('/api/currency', currency.getAllCurrencies);

    app.get('/api/currency/:id', currency.getCurrency);

    app.post('/api/currency', currency.postCurrency);

    app.put('/api/currency/:id', currency.updateCurrency);

    app.delete('/api/currency/:id', currency.deleteCurrency)

};