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
routes.get(/exchanges\/convert/, CurrencyExchangesController.convert);
routes.get("/exchanges/:symbol", CurrencyExchangesController.show);
routes.post("/exchanges", CurrencyExchangesController.store);
routes.delete("/exchanges/:symbol", CurrencyExchangesController.destroy);

module.exports = routes;