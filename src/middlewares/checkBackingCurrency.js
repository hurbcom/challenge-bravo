'use strict'

var checkNotExists = async (req, res, next) => {

    const { code } = req.body

    try {

        if (code != process.env.BACKING_CURRENCY) {
            return next()
        }else{
            res
            .status(400)
            .json({
                info: `${code} is the api backing currency, it is not possible to delete`
            })
        }
    } catch (e) {
        return res
        .status(500)
        .json(e)
    }
}

module.exports = checkNotExists