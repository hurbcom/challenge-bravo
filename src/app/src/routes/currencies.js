const express = require('express');

/* Error handler middleware */
const ErrorHandler = require('../middlewares/handlers/errorHandler');

/* Validators middlewares */
const addCurrencyValidator = require('../middlewares/validators/addCurrencyValidator');
const deleteCurrencyValidator = require('../middlewares/validators/deleteCurrencyValidator');
const getConversionValidator = require('../middlewares/validators/getConversionValidator');

/* Controllers */
const CurrenciesController = require('../controllers/CurrenciesController');


/* Currencies Database Connection */
const router = express.Router();

/** **** Currencies Routes *** * */

router.get('/currencies', ErrorHandler.handle(CurrenciesController.getCurrencies)
);

router.post('/currencies',
    addCurrencyValidator.validate,
    ErrorHandler.handle(CurrenciesController.addCurrency)
);

router.delete('/currencies/:currency',
    deleteCurrencyValidator.validate,
    ErrorHandler.handle(CurrenciesController.deleteCurrency)
);

router.get('/currencies/conversion',
    getConversionValidator.validate,
    ErrorHandler.handle(CurrenciesController.getConversion)
);

module.exports = router;
