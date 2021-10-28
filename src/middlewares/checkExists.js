'use strict'

const Currency = require('../models/Currency')

var checkExists = async (req, res, next) => {

    const { code } = req.body

    try {
        const q = await Currency.exists({code: code})

        if(q){
            res
            .status(400)
            .json({
                info: `currency with code ${code} already exists!`
            })
        }else{
            return next()
        }

    } catch (e) {
        return res
        .status(500)
        .json(e)
    }
}

module.exports = checkExists