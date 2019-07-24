require('dotenv').config()

const express = require('express')
const routes = require('./routes')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'
    this.routes()
  }

  routes () {
    this.express.use(routes)
  }
}

module.exports = new App().express
