const express = require('express');
const currencyController = require('../../app/controllers/currency.controller');

const router = express.Router();

router.get('/', currencyController.getAll);
router.post('/', currencyController.create);
router.delete('/:id', currencyController.destroy);

module.exports = router;
