'use strict'

const express = require('express');
require('dotenv').config()
const redis = require('redis');
const dbConnection = require('./database/database-connection')

class AppController {
    constructor() {
        this.express = express()
        this.middlewares()
        this.routes()
        this.db()
        this.cache()
    }

    middlewares() {
        this.express.use(express.json())
    }

    routes() {
        this.express.use(require('./routes'))
    }

    async db() {
        await dbConnection.conn
    }

    cache() {
        try{
            redis.createClient(process.env.REDIS_PORT);
        }catch(e){
            throw new Error(e)
        }
    }
}

module.exports = new AppController().express