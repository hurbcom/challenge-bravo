const express = require('express');
const router = express.Router();

const { validateBeforeConvert } = require('./validators/currencyValidators');

const HealthController = require('./controllers/HealthController');
const CurrencyController = require('./controllers/CurrencyController');

router.get('/health', HealthController.health);
router.get('/convert', validateBeforeConvert, CurrencyController.convert);

module.exports = router;