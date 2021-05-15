const routes = require("express").Router()

const CurrenciesController = require('./app/controllers/CurrenciesController')

routes.post('/currency',CurrenciesController.makeNewCurrency)
routes.patch('/currency/:code',CurrenciesController.updateCurrency)
routes.delete('/currency/:code',CurrenciesController.deleteCurrency)

routes.get('/currency/list',CurrenciesController.getAllCurrency)
routes.get('/currency/:code',CurrenciesController.getCurrency)
routes.get('/currency/transform/:from/:to/:amount',CurrenciesController.transform)

module.exports = routes