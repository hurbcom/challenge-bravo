'use strict'

const routes = require('express').Router()
require('express-group-routes')
let currencyController = require('./controllers/currencyController')
const checkCache = require('./middlewares/checkCache')

routes.group("/", async (router) => {
    router.use(checkCache)

    router.get("/", currencyController.getAllSupportedCurrencies)

    router.get("/conversion", currencyController.getConversion)

    router.post("/add", currencyController.addCurrency)

    router.delete("/delete/:slug", currencyController.deleteCurrency)

})



module.exports = routes