'use strict'

const Currency = require('../models/Currency')


var checkDatabase = async (req, res, next) => {

    Currency.estimatedDocumentCount(function (err, count){
        if (err) throw err;
        if(count>0){
            Currency.find({}, function(err, allCurrencies) {
                res
                .status(200)
                .json({
                    data: JSON.stringify(allCurrencies),
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