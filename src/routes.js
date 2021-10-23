'use strict'

const routes = require('express').Router()
require('express-group-routes')
const currencyController = require('./controllers/SignUpController')

routes.group("/", (router) => {

    var checkCache = (req, res, next) => {
        let search = req.params.search;
        client.get(search, (err, data) => {
            if (err) throw err;
            if (!data) {
                return next();
            } else {
                return res.json({
                    data: JSON.parse(data),
                    info: 'data from cache'
                })
            }
        })
    }

    router.get("/", checkCache, currencyController.getAllSupportedCurrencies)

    router.get("/conversion", checkCache, currencyController.getConversion)

    router.post("/add", checkCache, currencyController.addCurrency)

    router.delete("/delete/:slug", checkCache, currencyController.deleteCurrency)

})



module.exports = routes