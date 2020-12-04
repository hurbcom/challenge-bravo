let cors = require('cors');

// Inicializa o Router Express
const express = require('express');
const router = express.Router();

// Importa o controller de moedas
var currencyController = require('../controllers/currencyController');
// Importa o controller de conversão
var converterController = require('../controllers/converterController');
// Importa middlewares de validação de dados
const { currencyValidator } = require('../middleware/currencyValidator');
const { converterValidator } = require('../middleware/converterValidator');

router.use(cors());

// Define a mensagem padrão da API
router.get('/', function (req, res) {
    res.json({
        status: 'A API está funcionando.',
        message: 'Um serviço para conversão monetária!',
    });
});

// Rotas de moedas
router.get('/currencies/list', currencyController.findAll)
router.post('/currencies/new', currencyValidator, currencyController.create)
router.delete('/currencies/remove/id/:currency_id', currencyController.deleteByID)
router.delete('/currencies/remove/code/:sigla', currencyController.deleteByCode)
    
// Rotas de conversão de moedas
router.get('/convert', converterValidator, converterController.convert)

// Exportar endpoints da API
module.exports = router;