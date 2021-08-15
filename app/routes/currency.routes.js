module.exports = app => {
  const currency = require("../controllers/currency.controller.js");

  // Retrieve all Currencies
  app.get("/currency/custom", currency.findAll);

  // Create a Currency
  app.post("/currency/custom", currency.create);

  // Update a Currency with code
  app.put("/currency/custom", currency.update);

  // Delete a Currency with code
  app.delete("/currency/custom", currency.delete);

  // Get currency rate
  app.get("/currency/rate", currency.rate);

  // Get all currencies rates
  app.get("/currency/rates", currency.rates);

  // Converts from one currency to another
  app.get("/currency/convert", currency.convert);
};
