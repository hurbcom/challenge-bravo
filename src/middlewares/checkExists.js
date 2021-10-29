'use strict'

const Currency = require('../models/Currency')

var checkExists = async (req, res, next) => {

    const { code, codein } = req.body

    try {
        const q = await Currency.exists({code: code, codein: codein})

        if(q){
            res
            .status(400)
            .json({
                info: `currency already exists!`
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