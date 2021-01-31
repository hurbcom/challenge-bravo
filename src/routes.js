const express = require('express');
const router = express.Router();

const { validateBeforeConvert, validateBeforeAddCurrency } = require('./middlewares/currencyValidators');
const { authMiddleware } = require('./middlewares/authMiddlewares');

const UserController = require('./controllers/UserController');
const HealthController = require('./controllers/HealthController');
const CurrencyController = require('./controllers/CurrencyController');

// User routes
router.post('/users/register', UserController.register);
router.post('/users/login', UserController.authenticate);

// Other routes
router.get('/health', authMiddleware, HealthController.health);
router.get('/available-currencies', authMiddleware, CurrencyController.availableCurrencies);
router.post('/add-available-currencies', authMiddleware, validateBeforeAddCurrency, CurrencyController.addAvailableCurrencies);
router.get('/convert', authMiddleware, validateBeforeConvert, CurrencyController.convert);

module.exports = router;