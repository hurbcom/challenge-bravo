const { Router } = require('express');

const CurrenciesController = require('./src/controllers/CurrenciesController');
const CurrencyExchangesController = require('./src/controllers/CurrencyExchangesController');

const routes = Router();

/* Currencies */

routes.get("/currencies", CurrenciesController.index);
routes.get("/currencies/:id", CurrenciesController.show);
routes.post("/currencies", CurrenciesController.store);
routes.put("/currencies/:id", CurrenciesController.update);
routes.delete("/currencies/:id", CurrenciesController.destroy);

/* CurrencyExchanges */

routes.get("/exchanges", CurrencyExchangesController.index);
routes.get("/exchanges/:id", CurrencyExchangesController.show);
routes.post("/exchanges", CurrencyExchangesController.store);
routes.delete("/exchanges/:id", CurrencyExchangesController.destroy);

module.exports = routes;