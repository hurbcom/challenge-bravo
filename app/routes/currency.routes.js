module.exports = app => {
  const currency = require("../controllers/currency.controller.js");

  // Get currency rate
  app.get("/currency/rate", currency.rate);

  // Get all currencies rates
  app.get("/currency/rates", currency.rates);

  // Converts from one currency to another
  app.get("/currency/convert", currency.convert);
};
