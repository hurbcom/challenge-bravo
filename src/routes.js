const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => res.json({ message: 'API de conversão de moedas' }));

module.exports = routes;
