const express = require('express')
const http = require('http')
require('dotenv').config()
const app = express()
const server = http.createServer(app)
const port = process.env.PORT 
const router = require('./routes')
const rateService = require('./services/rates')

server.listen(port, () => {
  console.log(`express up on ${port}!`)
})

rateService.updateRates()
setInterval(() => rateService.updateRates(), 360000)

app.get('/', router)