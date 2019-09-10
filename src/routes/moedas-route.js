'use-strict'

// carregamento do módulo express e rotas
const express = require('express');
const router = express.Router();

// carregamento do controler de moedas
const controller = require('../controllers/moeda-controller');

// rotas de moedas
router.post('/', controller.post);
router.delete('/:moeda', controller.delete);

// exportação da rota de conversão
module.exports = router;
