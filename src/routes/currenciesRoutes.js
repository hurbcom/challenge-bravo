// REQUIRE CONTROLLER
const CurrenciesController = require("../controllers/currenciesController");

module.exports = (app) => {
    app.get("/", CurrenciesController.getCurrencies);
};
