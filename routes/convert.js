var express = require('express');
var cacheProvider = require('../cache-provider');
var currencies = require('../services/currencies');
var router = express.Router();

router.get('/', function(req, res, next) {
  let response;
  if (isRatesDateValid()) {
    response = setResponse(
      req.query.from.toUpperCase(),
      req.query.to.toUpperCase(),
      req.query.amount
    );
  } else {
    currencies().updateRates();
    response = updatingErrorReponse();
  }
  res.send(response);
});

router.get('/:origin/:destiny/:amount', function(req, res, next) {
  let response;
  if (isRatesDateValid()) {
    response = setResponse(
      req.params.origin.toUpperCase(),
      req.params.destiny.toUpperCase(),
      req.params.amount
    );
  } else {
    currencies().updateRates();
    response = updatingErrorReponse();
  }
  res.send(response);
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

function isRatesDateValid() {
  let today = new Date();
  let proposal = getLastValidDate(today);
  return proposal == rates.date;
}

function getLastValidDate(today) {
  let response = new Date();
  if (today.getDay() == 6) {
    response.setDate(today.getDate() - 1);
  }
  if (today.getDay() == 0) {
    response.setDate(today.getDate() - 2);
  }
  return response.getFullYear()+'-'+fillWithZeroes((response.getMonth()+1))+'-'+fillWithZeroes(response.getDate());
}

function fillWithZeroes(val) {
  if (val < 10) return '0'+val;
  return val;
}

function updatingErrorReponse() {
  return {
    error: 666,
    message: 'We\'re updating our currency rates, please try again soon'
  };
}

module.exports = router;
