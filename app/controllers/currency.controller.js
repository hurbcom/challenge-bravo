// const Forex = require("../models/forex/finnHubForex.model.js");
const Forex = require("../models/forex/Forex.model.js");

// Retrieve all Customers from the database.
exports.convert = (req, res) => {

  // Create a Forex
  const forex = new Forex();

  // forex.convertCurrencyValue("BRL", "USD", 10)
  //   .then(result => {
  //     res.send(result);
  //   })
  //   .catch(error => {
  //     res.status(500).send({
  //       message:
  //         error.message || "Some error occurred while retrieving customers."
  //     });
  //   });

  // forex.getRate("BTC")
  //   .then(result => {
  //     res.send(result);
  //   })
  //   .catch(error => {
  //     res.status(500).send({
  //       message:
  //         error.message || "Some error occurred while retrieving customers."
  //     });
  //   });

  forex.convertCurrencyValue('BRL', 'EUR', 100)
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