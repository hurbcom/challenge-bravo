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

/**
 * Adiciona uma moeda
 * 
 * @url /currencies
 * @method POST
 * @queryParam {string} currency
 * @queryParam {float} usd_value
 */
router.post('/', currencyController.addCurrency);

/**
 * Remove uma moeda
 * 
 * @url /currencies/{currency}
 * @method DELETE
 */
router.delete('/:currency', currencyController.removeCurrency);

module.exports = router;