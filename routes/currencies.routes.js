const { Router } = require('express');
const currenciesController = require('../controllers/currencies.controllers');

const router = Router();

router.post('/', currenciesController.createCurrency);

router.get('/', currenciesController.listCurrencies);

router.get('/:code', currenciesController.retrieveCurrency);

module.exports = router;
