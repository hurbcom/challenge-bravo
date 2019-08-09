const express = require('express');
const routes = express.Router();

const coinController = require('./app/controllers/coin');

// Responsável por validar e normalizar a requisição antes que vá para o controller.
const coinRequest = require('./app/requests/coin');

routes.get('/', (req, res) => res.json({ message: 'API de conversão de moedas' }));
routes.get('/convert', coinRequest.validate, coinRequest.normalize, coinController.convert);

module.exports = routes;
