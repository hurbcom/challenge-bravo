const express = require('express');
const currencyController = require('../../app/controllers/currency.controller');

const router = express.Router();

router.get('/', currencyController.getAll);

module.exports = router;
