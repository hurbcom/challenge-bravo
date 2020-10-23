const routes = require('express').Router()

const CurrencyController = require('../api/controllers/CurrencyController')
const ConvertController = require('../api/controllers/ConvertController')

// Currency routes
routes.post('/', ConvertController.convert)
routes.put('/', CurrencyController.create)
routes.delete('/:id', CurrencyController.delete)

module.exports = routes