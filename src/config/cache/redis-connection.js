'use strict'

const redis = require('redis')

function create() {
    try{
        const client = redis.createClient({
            host: process.env.REDIS_ENDPOINT || '127.0.0.1',
            port: process.env.REDIS_PORT || 6379
        })
        console.log("\x1b[35m", 'Connected to Redis')
        return client
    } catch (e) {
        throw new Error(e)
    }
}

module.exports = create()