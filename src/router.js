var express = require('express');
var router = express.Router();
const { default: Container } = require("typedi");
const CurrencyController = require('./controllers/currency-controller');
const ExchangeRatesService = require('./services/exchange-rates-service');


// Currency routes.
router.get('/currency', function (req, res) { 
	Container.get(CurrencyController).list(req, res);
 });
router.post('/currency', function (req, res) { 
	Container.get(CurrencyController).addCurrency(req, res);
 });
router.delete('/currency/:key', function (req, res) { 
	Container.get(CurrencyController).removeCurrency(req, res);
 });


module.exports = router;
