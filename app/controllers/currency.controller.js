const Forex = require("../models/finnHubForex.model.js");

// Retrieve all Customers from the database.
exports.convert = (req, res) => {

  // Create a Forex
  const forex = new Forex();

  forex.convertCurrencyValue("BRL", "USD", 10)
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Some error occurred while retrieving customers."
      });
    });
};