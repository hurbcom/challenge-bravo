const express = require('express');

const router = express.Router();
const { default: Container } = require('typedi');
const CurrencyController = require('./controllers/currency-controller');
const ExchangeController = require('./controllers/exchange-controller');

// Currency routes.
router.get('/currency', (req, res) => Container.get(CurrencyController).list(req, res));
router.post('/currency', (req, res) => Container.get(CurrencyController).addCurrency(req, res));
router.delete('/currency/:key', (req, res) =>
    Container.get(CurrencyController).removeCurrency(req, res)
);

// Exchange Routes
router.get('/currency/exchange/latest', (req, res) =>
    Container.get(ExchangeController).latest(req, res)
);
router.get('/currency/exchange', (req, res) =>
    Container.get(ExchangeController).exchange(req, res)
);

module.exports = router;
