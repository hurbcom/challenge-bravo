'use strict'

const Currency = require('../models/Currency')
let client = require('../config/cache/redis-connection')


var checkDatabase = async (req, res, next) => {

    Currency.estimatedDocumentCount(function (err, count){
        if (err) throw err;
        if(count>0){
            Currency.find({}, function(err, allCurrencies) {

                client.setex(
                    'allCurrencies',
                    process.env.REDIS_TTL,
                    JSON.stringify(allCurrencies)
                )

                res
                .status(200)
                .json({
                    data: allCurrencies,
                    info: 'data from database'
                })
            })
        }else{
            console.log('nothing in database')
            return next()
        }
    })
}

module.exports = checkDatabase