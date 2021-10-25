'use strict'

let client = require('./config/cache/redis-connection').create()

const routes = require('express').Router()
require('express-group-routes')
let currencyController = require('./controllers/currencyController')

var checkCache = (req, res, next) => {
    // let conversion = req.params.conversion;
    // client.get(conversion, (err, data) => {
    //     if (err) throw err;
    //     if (!data) {
            return next();
    //     } else {
    //         return res.json({
    //             data: JSON.parse(data),
    //             info: 'data from cache'
    //         })
    //     }
    // })
}

routes.group("/", async (router) => {
    router.use(checkCache)

    router.get("/", currencyController.getAllSupportedCurrencies)

    router.get("/conversion", currencyController.getConversion)

    router.post("/add", currencyController.addCurrency)

    router.delete("/delete/:slug", currencyController.deleteCurrency)

})



module.exports = routes