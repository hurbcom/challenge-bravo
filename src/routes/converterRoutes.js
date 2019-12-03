const express = require('express');
const router = express.Router();
const controller = require('../controllers/converterController');

//Declarando rota de GET para Conversão
router.get('/', controller.get);

module.exports = router;