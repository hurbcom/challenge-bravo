'use strict'

const routes = require('express').Router()
require('express-group-routes')
let currencyController = require('./controllers/currencyController')
let conversionController = require('./controllers/conversionController')

const checkCache = require('./middlewares/checkCache')
const checkDatabase = require('./middlewares/checkDatabase')
const checkNotExists = require('./middlewares/checkNotExists')
const checkExists = require('./middlewares/checkExists')
const checkBackingCurrency = require('./middlewares/checkBackingCurrency')
const checkConversionInCache = require('./middlewares/checkConversionInCache')

routes.group("/", async (router) => {

    router.get("/", currencyController.index)

    router.get("/all", [checkCache, checkDatabase], currencyController.getAllSupportedCurrencies)

    router.get("/conversion", conversionController.getConversion)

    router.put("/add", [checkBackingCurrency, checkExists], currencyController.addCurrency)

    router.delete("/delete", [checkBackingCurrency, checkNotExists], currencyController.deleteCurrency)

    router.get("/conversion", [checkConversionInCache], conversionController.getConversion)

})

module.exports = routes
