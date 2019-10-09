const express = require('express')

module.exports = function(server) {

    const router = express.Router()
    server.use('/api', router)

    const moedaService = require('../moedas/moedaService')
    moedaService.register(router, '/moeda')
}