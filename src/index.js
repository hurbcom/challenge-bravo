const express = require('express')
const http = require('http')
require('dotenv').config()
const app = express()
const server = http.createServer(app)
const port = process.env.PORT

/**
 * @description Iniciando o servidor do express
 * @author Mateus Schenatto <mateus.sche@gmail.com>
 */
server.listen(port, () => {
    console.log(`express up on ${port}!`)
})

module.exports = app