const express = require('express');
const { register } = require('../helpers');
const currencyConversionRouter = require('../../currency-conversion');
const healthRouter = require('../../health');


const router = express.Router();
register(
  ['/currency-conversion', currencyConversionRouter],
  ['/health', healthRouter],
)(router);


module.exports = router;
