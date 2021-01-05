const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const NodeCache = require("node-cache");

const {
  getHealth,
  getConversion,
  postCurrency,
  deleteCurrency
} = require('./_controllers')

dotenv.config()

const cors = require('../server/cors')
const expressCallBack = require('../server/endpoint-callback')

const app = express()
app.use(bodyParser.json())


app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (cors.allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cookieParser())

const setUpRoutes = () => {

  const myCache = new NodeCache();
  const supportedCurrencies = require('../src/supportedCurrencies')

  myCache.set('supported-currencies', supportedCurrencies)

  app.get('/health', expressCallBack(getHealth, myCache))
  app.get('/conversion', expressCallBack(getConversion, myCache))
  app.post('/currency', expressCallBack(postCurrency, myCache))
  app.delete('/currency', expressCallBack(deleteCurrency, myCache))

  return app
}

module.exports = {
  createServer: () => setUpRoutes()
}