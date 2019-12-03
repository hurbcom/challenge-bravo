const express = require('express');
const router = express.Router();
const controller = require('../controllers/coinsController');

//Declarando rotas de Coin
router.post('/', controller.post);
router.delete('/', controller.delete);
router.get('/', controller.get);

module.exports = router;