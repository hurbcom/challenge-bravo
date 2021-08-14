module.exports = app => {
  const currency = require("../controllers/currency.controller.js");

  // Converts from one currency to another
  app.get("/currency/convert", currency.convert);
};
