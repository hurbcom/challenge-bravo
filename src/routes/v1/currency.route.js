const express = require('express');
const currencyController = require('../../app/controllers/currency.controller');
const validate = require('../../app/middlewares/validate');
const currencyValidation = require('../../app/validations/currency.validation');

const router = express.Router();

router.get('/convert/:from/:to/:amount', validate(currencyValidation.conversionCurrency), currencyController.getConversion);
router.get('/', currencyController.getAll);
router.post('/', validate(currencyValidation.createCurrency), currencyController.create);
router.delete('/:id', validate(currencyValidation.deleteCurrency), currencyController.destroy);

module.exports = router;
