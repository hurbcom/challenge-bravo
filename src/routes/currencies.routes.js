const { Router } = require('express');
const { check } = require('express-validator');
const { listCurrencies, getCurrency, createCurrency, deleteCurrency } = require('../controllers/currencies.controller');
const router = Router();
const { currencies } = require('../middleware/validator.middleware');

//get
router.get('/', listCurrencies);
router.get('/:code', getCurrency);

//post
router.post('/', currencies, createCurrency);

//delete
router.delete('/:code', deleteCurrency);

module.exports = router;