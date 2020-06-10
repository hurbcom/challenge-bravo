const { Router } = require('express');
const CoinController = require('./app/controllers/CoinController');
const routes = Router();

routes.get('/', (req, res) => {
    res.send('Hello World')
})

routes.get('/coins', CoinController.index);
routes.post('/coins', CoinController.store);
routes.put('/coins', CoinController.update);
routes.delete('/coins', CoinController.delete);

routes.get('/conversion', CoinController.conversion);

module.exports = routes