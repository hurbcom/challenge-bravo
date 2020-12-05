var express = require('express');
var router = express.Router();
var CurrentCurrency = require("./currencyController");

// we will use 3 routes (endpoint) for this api
router.get('/ChangeCurrency', CurrentCurrency.ChangeCurrency);
router.post('/AddCurrency', CurrentCurrency.AddCurrency);
router.delete('/RemoveCurrency', CurrentCurrency.RemoveCurrency);

module.exports = router