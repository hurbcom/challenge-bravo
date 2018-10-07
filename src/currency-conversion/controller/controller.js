const express = require('express');
const { split } = require('ramda');
const { getToday } = require('../helpers');
const rules = require('../rules');
const { cryptoCompare } = require('../../core/integrations');

const router = express.Router();


const _calcAmountByRates = (rates, amount) => {
  const amountObj = {};
  Object.keys(rates).forEach((coin) => {
    amountObj[coin] = rates[coin] * amount;
  });
  return amountObj;
};

const _formatResponse = (from, rates, amount) => ({
  amount: Number(amount),
  base: from,
  date: getToday(),
  rates: {
    ...rates,
  },
  converted: {
    ..._calcAmountByRates(rates, amount),
  },
});

const conversion = async (req, res) => {
  const { from, to, amount } = req.query;
  const toSplited = split(',', to);
  try {
    const ratesByCoins = await cryptoCompare({ from, to: toSplited });
    const response = _formatResponse(from, ratesByCoins, amount);
    res.json(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};


router.get('/', [...rules], conversion);

module.exports = router;
