// const Forex = require("../models/forex/finnHubForex.model.js");
const Forex = require("../models/forex/Forex.model.js");

// Get currency rate
exports.rate = (req, res) => {

  let currency = req.query.currency;
  if(!currency)
    res.status(400).send({ message: "currency is a required param." });

  // Create a Forex
  let forex = new Forex();
  forex.getRate(currency)
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

  // Create a Forex
  let forex = new Forex();
  forex.getRates()
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