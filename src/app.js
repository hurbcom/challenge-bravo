'use strict'

const express = require('express');
const redis = require('redis');
const dbConnection = require('./database/database-connection')

class AppController {
    constructor() {
        this.express = express()
        this.middlewares()
        this.routes()
        this.db()
        this.redis = redis()
    }

    middlewares() {
        this.express.use(express.json())
    }

    routes() {
        this.express.use(require('./routes'))
    }

    async db() {
        await dbConnection.db()
    }

    cache() {
        try{
            this.redis.createClient(process.env.REDIS_PORT);
        }catch(e){
            throw new Error(e)
        }
    }
}

module.exports = new AppController().express