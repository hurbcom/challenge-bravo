'use strict'

let client = require('../config/cache/redis-connection')

var checkConversionInCache = (req, res, next) => {
    const { to, from, amount } = req.query

    client.get(`${from}${to}`, (err, data) => {
        if (err) throw err;
        if (!data) {
            console.log('nothing conversion in cache')
            return next()
        } else {
            let parseData = JSON.parse(data)
            let converted_value = amount / parseData.bid

            return res
            .status(200)
            .json({
                data: JSON.parse(data),
                converted_value: parseFloat(converted_value).toFixed(process.env.DECIMAL_PLACES),
                info: "data from cache"
            })
        }
    })
}

module.exports = checkConversionInCache