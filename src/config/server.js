// Imports
const express = require('express')
const http = require('http')
require('dotenv').config()
const bodyParser = require('body-parser');
const port = process.env.PORT
const routes = require('../routes')
const rateService = require('../services/rates')
const allowCors = require('./cors')

// Configurando servidor
const app = express()
const server = http.createServer(app)
server.listen(port)

// Config Middlewares
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(allowCors);

// Update cotações
rateService.update()

// Routes register
app.use('/', routes);

module.exports = app