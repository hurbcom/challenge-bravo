'use strict'

const routes = require('express').Router()
require('express-group-routes')
let currencyController = require('./controllers/currencyController')
let conversionController = require('./controllers/conversionController')

const checkCache = require('./middlewares/checkCache')
const checkDatabase = require('./middlewares/checkDatabase')

routes.group("/", async (router) => {

    router.get("/", currencyController.index)

})

routes.group("/currency", async (router) => {

    router.put("/add", currencyController.addCurrency)

    router.delete("/delete/:code", currencyController.deleteCurrency)

})

routes.group("/", async (router) => {

    router.use(checkCache)
    router.use(checkDatabase)

    router.get("/all", currencyController.getAllSupportedCurrencies)

    router.get("/conversion", conversionController.getConversion)

})

module.exports = routes
