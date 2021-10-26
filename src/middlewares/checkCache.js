'use strict'

let client = require('../config/cache/redis-connection')

const Currency = require('../models/Currency')

var checkCache = (req, res, next) => {
    let search = req.params.search || 'allCurrencies';
    client.get(search, (err, data) => {
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