'use strict'

const routes = require('express').Router()
require('express-group-routes')
let currencyController = require('./controllers/currencyController')
const checkCache = require('./middlewares/checkCache')
const checkDatabase = require('./middlewares/checkDatabase')

routes.group("/", async (router) => {
    router.use(checkCache, checkDatabase)

    router.get("/", currencyController.getAllSupportedCurrencies)

    router.get("/conversion", currencyController.getConversion)

    router.post("/add", currencyController.addCurrency)

    router.delete("/delete/:slug", currencyController.deleteCurrency)

})



module.exports = routes