const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currency-controller')

router.get('/', currencyController.listAll);
router.post('/', currencyController.create);
router.put('/', currencyController.update);
router.delete('/', currencyController.delete);

module.exports = router;