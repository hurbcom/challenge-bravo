const { Router } = require('express');
const currenciesController = require('../controllers/currencies.controllers');

const router = Router();

router.post('/', currenciesController.createCurrency);

module.exports = router;
