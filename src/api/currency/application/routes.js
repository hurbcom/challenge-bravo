const { Router } = require("express")
const Status = require("http-status")

module.exports = ({
    logger,
    response: { Success, Fail },
    currencyConversionAppService
}) => {
    const router = Router()

    router.get('/convert', (req, res) => {
        const { from, to, amount } = req.query

        currencyConversionAppService.convert(from, to, amount)
            .then(data => res.status(Status.OK).json(Success(data)))
            .catch(err => {
                logger.error(err)
                res.status(Status.BAD_REQUEST).json(Fail(err.message))
            })
    })

    return router;
}