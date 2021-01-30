const express = require('express');

const routes = express.Router();

const { container } = require('../config/di-setup');

const currencyController = container.resolve('currencyController');
const conversionController = container.resolve('conversionController');

routes.get('/health-status', (_, res) => res.json({ status: 'ok' }));

routes.get('/currency', (req, res) => currencyController.listCurrencies(req, res));
routes.post('/currency', (req, res) => currencyController.addCurrency(req, res));
routes.delete('/currency/:key', (req, res) => currencyController.removeCurrency(req, res));

routes.get('/currency/convert/latest', (req, res) => conversionController.latest(req, res));
routes.get('/currency/convert', (req, res) => conversionController.convert(req, res));

module.exports = routes;
