const express = require('express');

const routes = express.Router();
const priceConversionController = require('../../controllers/priceConversionController');

routes.get('/', (_req, res) => {
  res.status(200).send('Welcome to the Challenge Bravo');
});

routes.get('/api/v1/currency_quotes', priceConversionController.priceConversion);

module.exports = routes;
