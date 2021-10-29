'use strict'

let client = require('../config/cache/redis-connection')
const Currency = require('../models/Currency')

var checkConversionInDB = (req, res, next) => {
    const { to, from, amount } = req.query

    Currency.findOne({ code: from, codein: to }, function(err, data) {
        if (err) throw err;
        if(data){
        const converted_value = amount / data.bid
        client.setex(
            `${from}${to}`,
            process.env.REDIS_TTL,
            JSON.stringify(data)
        )

        return res
        .status(200)
        .json({
            data: data,
            converted_value: parseFloat(converted_value).toFixed(process.env.DECIMAL_PLACES),
            info: "data from database"
        })
        }else{
            console.log('nothing in database')
            return next()
        }
    })
}

module.exports = checkConversionInDB