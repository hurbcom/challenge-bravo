require('dotenv').config()

const express = require('express')
const routes = require('./routes')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'
    this.routes()
    this.middlewares()
  }

  middlewares () {
    this.express.use(express.json())
  }

  routes () {
    this.express.use(routes)
  }
}

module.exports = new App().express
