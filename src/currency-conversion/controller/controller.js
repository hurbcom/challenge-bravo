const express = require('express');
const { split } = require('ramda');
const rules = require('../rules');
const { cryptoCompare, exchangeRatesApi } = require('../../core/integrations');

const router = express.Router();


const conversion = async (req, res) => {
  const { from, to } = req.query;
  Promise.all([
    cryptoCompare({ from, to: split(',', to) }),
    exchangeRatesApi({ from: 'BTC', to: split(',', 'ETH') }),
  ]).then(([result, result2]) => {
    res.json({
      result,
      result2,
    });
  });
};


router.get('/', [...rules], conversion);

module.exports = router;
