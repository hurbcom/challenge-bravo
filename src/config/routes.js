const express = require('express')
const exchange = require('../exchange')

module.exports = function(server) {

    const router = express.Router()
    server.use('/api', router)

    const currencyService = require('../Currency/currencyService')
    currencyService.register(router, '/currency')

    router.get('/exchange', exchange.getExchange);

}