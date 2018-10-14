const express = require('express');
const { split } = require('ramda');
const { converter, getToday } = require('../helpers');
const rules = require('../rules');
const { cryptoCompare } = require('../../core/integrations');

const router = express.Router();


const _formatResponse = (amount, from, rates, converted) => ({
  amount: Number(amount),
  base: from,
  date: getToday(),
  rates,
  converted,
});

const conversion = async (req, res) => {
  const { from, to, amount } = req.query;
  const toSplited = split(',', to);
  try {
    const ratesByCoins = await cryptoCompare.request({ from, to: toSplited });
    const convertedByRates = converter.calcAmountByRates(ratesByCoins, amount);
    const response = _formatResponse(amount, from, ratesByCoins, convertedByRates);
    res.json(response);
  } catch (err) {
    res.sendStatus(500);
  }
};


router.get('/', [...rules], conversion);
module.exports = router;
