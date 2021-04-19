const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');

/**
 * Faz a conversão da moeda de acordo com os parâmetros passados
 * 
 * @url /currencies
 * @method GET
 * @queryParam {string} from
 * @queryParam {string} to
 * @queryParam {float} amount
 */
router.get('/', currencyController.convertCurrency);

module.exports = router;