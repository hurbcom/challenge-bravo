const appConfig = require("../config/app.config.js");
const db = require("../models");
const Currency = db.currency;
const Forex = require("../models/forex/forex.model.js");

// Retrieve all Currencies from the database and forex.
exports.findAll = (req, res) => {

  Currency.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};


// Get currency rate
exports.create = (req, res) => {

  let code = req.body.code;
  if(!code)
    res.status(400).send({ message: "code is a required param." });

  let usd_value = req.body.usd_value;
  if(!usd_value)
    res.status(400).send({ message: "usd_value is a required param." });

  // transforming currency code to uppercase
  code = code.toUpperCase();

  // Create a Tutorial
  const teste = {
    'code': code,
    'usd_value': usd_value
  };

  // Save Tutorial in the database
  Currency.create(teste)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Update a Tutorial by the code in the request
exports.update = (req, res) => {
  
  let code = req.body.code;
  if(!code)
    res.status(400).send({ message: "code is a required param." });

  let usd_value = req.body.usd_value;
  if(!usd_value)
    res.status(400).send({ message: "usd_value is a required param." });

  // transforming currency code to uppercase
  code = code.toUpperCase();

  Currency.update({
    code: code,
    usd_value: usd_value
  }, {
    where: { code: code }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Currency was updated successfully."
        });
      } else {
        res.send({
          message: `Currency not found`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Currency with code=" + id
      });
    });
};

// Delete a Currency with the specified code in the request
exports.delete = (req, res) => {
  
  let code = req.body.code;
  if(!code)
    res.status(400).send({ message: "code is a required param." });

  // transforming currency code to uppercase
  code = code.toUpperCase();

  Currency.destroy({
    where: { code: code }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Currency was deleted successfully!"
        });
      } else {
        res.send({
          message: `Currency not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Currency with code=" + code
      });
    });
};


// Get currency rate
exports.rate = (req, res) => {

  let base = req.query.base;
  if(!base)
    base = appConfig.CURRENCY_BASE;

  let currency = req.query.currency;
  if(!currency)
    res.status(400).send({ message: "currency is a required param." });

  // transforming currency codes to uppercase
  base = base.toUpperCase();
  currency = currency.toUpperCase();

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

  // transforming currency code to uppercase
  base = base.toUpperCase();

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

  // transforming currency codes to uppercase
  from = from.toUpperCase();
  to = to.toUpperCase();

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