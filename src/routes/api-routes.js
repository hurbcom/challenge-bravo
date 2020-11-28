let cors = require('cors');
// Inicializa o Router Express
const express = require('express');
const router = express.Router();

const validator = require('express-joi-validation').createValidator({})
const Validation =  require('../middleware/validator')

router.use(cors());

// Define a mensagem padrão da API
router.get('/', function (req, res) {
    res.json({
        status: 'A API está funcionando.',
        message: 'Um serviço para conversão monetária!',
    });
});

// Importa o controller de planetas
var currencyController = require('../controllers/currencyController');
var currencyService = require('../services/currencyService');

//router.get('/currencies/list', currencyController.index)
//router.put('/currencies/list', validator.body(Validation.bodySchema), currencyController.new)

router.route('/currencies/list')
    .get(currencyService.index)

router.route('/currencies/new')
    .post(currencyService.new);

router.route('/currencies/remove/id/:currency_id')
    .delete(currencyService.delete);

/*router.route('/:id')
    .delete(CurrencyController.delete);
*/
// Exportar endpoints da API
module.exports = router;