let cors = require('cors');

// Inicializa o Router Express
const express = require('express');
const router = express.Router();

const { body, query, check } = require("express-validator");

router.use(cors());

// Define a mensagem padrão da API
router.get('/', function (req, res) {
    res.json({
        status: 'A API está funcionando.',
        message: 'Um serviço para conversão monetária!',
    });
});

// Importa o controller de moedas
var currencyController = require('../controllers/currencyController');

router.get('/currencies/list', currencyController.findAll)
router.post('/currencies/new', [
    body('sigla').isIn([ 'USD', 'BRL', 'EUR', 'BTC', 'ETH' ]).withMessage("Esta moeda não é suportada pela API."),
    body('sigla').isUppercase().withMessage("A sigla da moeda deve ser digitada em maiúsculo."),
    body('sigla').isLength({ min: 3, max: 3 }).withMessage("A sigla da moeda deve possuir 3 caracteres."),
    body('nome').isLength({ min: 3, max: 100 }).withMessage("O nome da moeda precisa ter no mínimo 3 caracteres e no máximo 100.")
], currencyController.create)
router.delete('/currencies/remove/id/:currency_id', currencyController.delete)

// Exportar endpoints da API
module.exports = router;