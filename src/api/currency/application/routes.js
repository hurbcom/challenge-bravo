/** currency/routes.js
 * Routes for currency-related services
 */
const { Router } = require("express")
const Status = require("http-status")

module.exports = ({
    logger,
    currencyAppService,
    currencyConversionAppService,
    response: { Success, Fail }
}) => {
    const router = Router()

    router.get('/convert', (req, res, next) => {
        const { from, to, amount } = req.query

        currencyConversionAppService.get(req, res, next, from, to, amount)
            .catch(err => {
                logger.error(err)
                res.status(Status.BAD_REQUEST).json(Fail(err.message))
            })
    })

    router.get('/', (req, res, next) => {
        currencyAppService.get(req, res, next)
            .catch(err => {
                logger.error(err)
                res.status(Status.BAD_REQUEST).json(Fail(err.message))
            })
    })

    router.post('/', (req, res, next) => {
        currencyAppService.post(req, res, next, req.body)
            .catch(err => {
                logger.error(err)
                res.status(Status.BAD_REQUEST).json(Fail(err.message))
            })
    })

    router.delete('/', (req, res, next) => {
        const { id } = req.query
        currencyAppService.del(req, res, next, id)
            .catch(err => {
                logger.error(err)
                res.status(Status.BAD_REQUEST).json(Fail(err.message))
            })
    })

    return router;
}