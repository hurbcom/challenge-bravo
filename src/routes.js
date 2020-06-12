const { Router } = require('express');
const CoinController = require('./app/controllers/CoinController');
const routes = Router();

routes.get('/coins', CoinController.index);
routes.post('/coins', CoinController.store);
routes.put('/coins/:id', CoinController.update);
routes.delete('/coins/:id', CoinController.delete);

routes.get('/conversion', CoinController.conversion);

module.exports = routes