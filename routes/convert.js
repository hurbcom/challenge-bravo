var express = require('express');
var cacheProvider = require('../cache-provider');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('convert');
});

router.get('/:origin/:destiny/:value', function(req, res, next) {
  let rates = cacheProvider.instance().get('rates');
  let response = {};
  let origin = req.params.origin.toUpperCase();
  let destiny = req.params.destiny.toUpperCase();

  if (rates.rates[origin]) {
    response = {
      original: {
        currency: origin,
        value: req.params.value
      },
      result: {
        currency: destiny,
        value: calcConversion(origin, destiny, req.params.value)
      }
    };
  }
  res.send(response);
});

function calcConversion(origin, dest, val) {
  if (origin == rates.base) return val * rates.rates[dest];
  if (dest == rates.base) return val / rates.rates[origin];
  return val / rates.rates[origin] * rates.rates[dest];
}

module.exports = router;
