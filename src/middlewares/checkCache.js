'use strict'

let client = require('../config/cache/redis-connection')

var checkCache = (req, res, next) => {
    client.get('allCurrencies', (err, data) => {
        if (err) throw err;
        if (!data) {
            console.log('nothing in cache')
            return next()
        } else {
            return res.json({
                data: JSON.parse(data),
                info: 'data from cache'
            })
        }
    })
}

module.exports = checkCache