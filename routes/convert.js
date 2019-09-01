var express = require('express');
var cacheProvider = require('../cache-provider');
var router = express.Router();

router.get('/', function(req, res, next) {
  let origin = req.query.from.toUpperCase();
  let destiny = req.query.to.toUpperCase();
  let amount = req.query.amount;
  res.send(setResponse(origin, destiny, amount));
});

router.get('/:origin/:destiny/:amount', function(req, res, next) {
  let origin = req.params.origin.toUpperCase();
  let destiny = req.params.destiny.toUpperCase();
  let amount = req.params.amount;
  res.send(setResponse(origin, destiny, amount));
});

function setResponse(origin, destiny, amount) {
  return {
    original: {
      currency: origin,
      amount: amount
    },
    result: {
      currency: destiny,
      amount: calcConversion(origin, destiny, amount)
    }
  };
}

function calcConversion(origin, dest, amount) {
  let rates = cacheProvider.instance().get('rates');
  if (origin == rates.base) return amount * rates.rates[dest];
  if (dest == rates.base) return amount / rates.rates[origin];
  return amount / rates.rates[origin] * rates.rates[dest];
}

module.exports = router;
