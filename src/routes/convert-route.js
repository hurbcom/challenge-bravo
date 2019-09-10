'use-strict'

// carregamento do módulo express e rotas
const express = require('express');
const router = express.Router();

// carregamento do controler de conversão
const controller = require('../controllers/convert-controller');

// rota de conversão de valores
router.get('/:from/:to/:amount', controller.get);

// exportação da rota de conversão
module.exports = router;
