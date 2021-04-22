const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

/**
 * Faz a conversão da moeda de acordo com os parâmetros passados
 * 
 * @url /login
 * @method POST
 * @bodyParam {string} username
 * @bodyParam {string} password
 */
router.post('/', loginController.doLogin);

module.exports = router;