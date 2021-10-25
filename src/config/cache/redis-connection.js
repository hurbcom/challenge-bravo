'use strict'

const redis = require('redis')

function create() {
    try{
        const client = redis.createClient(process.env.REDIS_PORT)
        return client
    } catch (e) {
        throw new Error(e)
    }
}

module.exports = create()