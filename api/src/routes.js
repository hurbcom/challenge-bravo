const express = require('express')
const routes = express.Router()
const CurrencyController = require('./controllers/CurrencyController')

routes.get('/api/v1/currency', CurrencyController.index)
routes.post('/api/v1/currency', CurrencyController.store)
routes.delete('/api/v1/currency', CurrencyController.delete)

module.exports = routes