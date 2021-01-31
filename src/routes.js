const express = require('express');
const router = express.Router();

const { validateBeforeConvert, validateBeforeAddCurrency } = require('./validators/currencyValidators');

const HealthController = require('./controllers/HealthController');
const CurrencyController = require('./controllers/CurrencyController');

router.get('/health', HealthController.health);
router.get('/available_currencies', CurrencyController.availableCurrencies);
router.post('/add-available-currencies', validateBeforeAddCurrency, CurrencyController.addAvailableCurrencies);
router.get('/convert', validateBeforeConvert, CurrencyController.convert);

module.exports = router;