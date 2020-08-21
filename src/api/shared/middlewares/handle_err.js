const Status = require('http-status')

module.exports = (err, req, res, next, logger, config) => {
    console.log("logger", logger)
    logger.error(err)

    const response = Object.assign({
        type: 'InternalServerError'
    }, config.env === 'development' && {
        message: err.message,
        stack: err.stack
    })

    res.status(Status.INTERNAL_SERVER_ERROR).json(response)
}