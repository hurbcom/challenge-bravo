'use strict'

const routes = require('express').Router()
require('express-group-routes')
let currencyController = require('./controllers/currencyController')
let conversionController = require('./controllers/conversionController')

const checkCache = require('./middlewares/checkCache')
const checkNotExists = require('./middlewares/checkNotExists')
const checkExists = require('./middlewares/checkExists')
const checkBackingCurrency = require('./middlewares/checkBackingCurrency')
const checkConversionInCache = require('./middlewares/checkConversionInCache')
const checkConversionInDB = require('./middlewares/checkConversionInDB')
const checkAmountIsNumber = require('./middlewares/checkAmountIsNumber')



routes.group("/", async (router) => {

    router.get("/", currencyController.index)

    router.get("/all", [checkCache], currencyController.getAllSupportedCurrencies)

    router.put("/add", [checkExists, checkBackingCurrency], currencyController.addCurrency)

    router.delete("/delete", [checkNotExists], currencyController.deleteCurrency)

    router.get("/conversion", [checkAmountIsNumber, checkConversionInCache, checkConversionInDB], conversionController.getConversion)

})

module.exports = routes
