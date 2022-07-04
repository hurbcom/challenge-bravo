// REQUIRE CONTROLLER
const CurrenciesController = require("../controllers/currenciesController");

module.exports = (app) => {
    app.get("/", CurrenciesController.getCurrencies);
    app.post("/currency", CurrenciesController.createCurrency);
    app.delete("/currency/:id", CurrenciesController.deleteCurrency);
    app.get("/currency/exchange/", CurrenciesController.exchangeCurrencies);
};
