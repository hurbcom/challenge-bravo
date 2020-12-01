let cors = require('cors');

// Inicializa o Router Express
const express = require('express');
const router = express.Router();

const { body, query } = require("express-validator");

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
// Importa o controller de conversão
var converterController = require('../controllers/converterController');

router.get('/currencies/list', currencyController.findAll)
router.post('/currencies/new', [
    body('sigla').isIn([ 'USD', 'BRL', 'EUR', 'BTC', 'ETH' ]).withMessage("Esta moeda não é suportada pela API."),
    body('sigla').isUppercase().withMessage("A sigla da moeda deve ser digitada em maiúsculo."),
    body('sigla').isLength({ min: 3, max: 3 }).withMessage("A sigla da moeda deve possuir 3 caracteres."),
    body('nome').isLength({ min: 3, max: 100 }).withMessage("O nome da moeda precisa ter no mínimo 3 caracteres e no máximo 100.")
], currencyController.create)
router.delete('/currencies/remove/id/:currency_id', currencyController.deleteByID)
router.delete('/currencies/remove/code/:sigla', currencyController.deleteByCode)
    
router.get('/convert', [
    query('from').notEmpty().withMessage("A moeda de origem deve ser informada."),
    query('from').isUppercase().withMessage("A sigla da moeda de origem deve ser digitada em maiúsculo."),
    query('to').notEmpty().withMessage("A moeda de destino deve ser informada."),
    query('to').isUppercase().withMessage("A sigla da moeda de destino deve ser digitada em maiúsculo."),
    query('amount').notEmpty().withMessage("O valor para conversão deve ser informado."),
    query('amount').isFloat({ gt: 0 }).withMessage("O valor precisa ser maior que zero.")
], converterController.convert)

// Exportar endpoints da API
module.exports = router;