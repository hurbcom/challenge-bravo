const express = require('express');
const routes = express.Router();

const CoinController = require('./controller/CoinController');
const ConverterController = require('./controller/CoinExchangeController');


routes.get("/exchanges", ConverterController.index);
routes.get(/exchanges\/convert/, ConverterController.convert);
routes.get("/exchanges/:to", ConverterController.show);
routes.post("/exchanges", ConverterController.create);
routes.delete("/exchanges/:to", ConverterController.delete);

routes.get("/coins", CoinController.index);
routes.get("/coins/:to", CoinController.show);
routes.post("/coins", CoinController.create);
routes.put("/coins/:to", CoinController.update);
routes.delete("/coins/:to", CoinController.delete);




module.exports = routes;