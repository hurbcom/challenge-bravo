'use strict'

const express = require('express');
require('dotenv').config()

const db = require('./config/database/database-connection')


class AppController {
    constructor() {
        this.express = express()
        this.middlewares()
        this.routes()
        this.connectDB()
    }

    middlewares() {
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: true }))
    }

    routes() {
        this.express.use(require('./routes'))
    }

    connectDB() {
        return db()
    }
}

module.exports = new AppController().express