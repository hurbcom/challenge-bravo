const appConfig = require("../config/app.config.js");
const Forex = require("../models/forex/forex.model.js");

// Get currency rate
exports.rate = (req, res) => {

  let base = req.query.base;
  if(!base)
    base = appConfig.CURRENCY_BASE;

  let currency = req.query.currency;
  if(!currency)
    res.status(400).send({ message: "currency is a required param." });

  // Create a Forex
  let forex = new Forex();
  forex.getRate(base, currency)
    .then(result => {

      res.send(result);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error occurred while retrieving data."
      });
    });
};

// Get all currencies rates
exports.rates = (req, res) => {

  let base = req.query.base;
  if(!base)
    base = appConfig.CURRENCY_BASE;

  // Create a Forex
  let forex = new Forex();
  forex.getRates(base)
    .then(result => {

      res.send(result);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error occurred while retrieving data."
      });
    });
};

// Converts from one currency to another
exports.convert = (req, res) => {

  let from = req.query.from;
  if(!from)
    res.status(400).send({ message: "from is a required param." });

  let to = req.query.to;
  if(!to)
    res.status(400).send({ message: "to is a required param." });

  let amount = req.query.amount;
  if(!amount)
    res.status(400).send({ message: "amount is a required param." });

  // Create a Forex
  let forex = new Forex();
  forex.convertCurrencyValue(from, to, amount)
    .then(result => {

      res.send(result);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error occurred while retrieving data."
      });
    });
};