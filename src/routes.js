'use strict'

const routes = require('express').Router()
require('express-group-routes')
let currencyController = require('./controllers/currencyController')
let conversionController = require('./controllers/conversionController')

const checkCache = require('./middlewares/checkCache')
const checkDatabase = require('./middlewares/checkDatabase')

routes.group("/", async (router) => {

    router.use(checkCache)
    router.use(checkDatabase)

    router.get("/", currencyController.getAllSupportedCurrencies)

    router.get("/conversion", conversionController.getConversion)

    router.put("/add", currencyController.addCurrency)

    router.delete("/delete/:code", currencyController.deleteCurrency)

})



module.exports = routes