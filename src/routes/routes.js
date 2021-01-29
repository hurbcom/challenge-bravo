const express = require('express');
const routes = express.Router();

const CurrencyController = require('../controllers/CurrencyController');
const ConversionController = require('../controllers/ConversionController');

routes.get('/health-status', (_, res) => res.json({ status: 'ok' }))

routes.get('/currency', (req, res) => CurrencyController.listCurrencies(req, res));
routes.post('/currency', (req, res) => CurrencyController.addCurrency(req, res));
routes.delete('/currency/:key', (req, res) => CurrencyController.removeCurrency(req, res));

routes.get('/currency/convert/latest', (req, res) => ConversionController.latest(req, res));
routes.get('/currency/convert', (req, res) => ConversionController.convert(req, res));

module.exports = routes;
