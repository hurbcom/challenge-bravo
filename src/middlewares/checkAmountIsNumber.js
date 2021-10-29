'use strict'

var checkAmountIsNumber = async (req, res, next) => {

    const { amount } = req.query
    if (!amount || isNaN(amount)) {
        res
        .status(400)
        .json({
            info: `amount needs to be a number!`
        })
    }else{
        return next()
    }
}

module.exports = checkAmountIsNumber