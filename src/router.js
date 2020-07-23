var express = require('express');
var router = express.Router();
const { default: Container } = require("typedi");
const CurrencyController = require('./controllers/currency-controller');
const ExchangeController = require('./controllers/exchange-controller');


// Currency routes.
router.get('/', (req, res) => Container.get(CurrencyController).list(req, res) );
router.post('/', (req, res) => Container.get(CurrencyController).addCurrency(req, res) );
router.delete('/:key', (req, res) => Container.get(CurrencyController).removeCurrency(req, res) );


 //Exchange Routes
 router.get('/exchange/latest', (req, res) => Container.get(ExchangeController).latest(req, res) );
 router.get('/exchange', (req, res) => Container.get(ExchangeController).exchange(req, res) );
 
module.exports = router;
