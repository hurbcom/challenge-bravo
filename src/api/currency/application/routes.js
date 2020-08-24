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

    /**
     * @swagger
     * /currency/convert?from={from}&to={to}&amount={amount}:
     *   get:
     *     tags:
     *       - currency
     *       - conversion
     *     description: Converts amount based on passed rates.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: from
     *         description: Currency abbreviation to convert from
     *         in: query
     *         required: true
     *         type: string
     *       - name: to
     *         description: Currency abbreviation to convert to
     *         in: query
     *         required: true
     *         type: string
     *       - name: amount
     *         description: The amount to convert
     *         in: query
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: API Status
     */
    router.get('/convert', (req, res, next) => {
        const { from, to, amount } = req.query

        currencyConversionAppService.get(req, res, next, from, to, amount)
            .catch(err => {
                logger.error(err)
                res.status(Status.BAD_REQUEST).json(Fail(err.message))
            })
    })

    /**
     * @swagger
     * /currency:
     *   get:
     *     tags:
     *       - currency
     *     description: Returns all allowed currencies to be used
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: All allowed currencies to be used
     *       500:
     *         description: Server could not handle response
     */
    router.get('/', (req, res, next) => {
        currencyAppService.get(req, res, next)
            .catch(err => {
                logger.error(err)
                res.status(Status.BAD_REQUEST).json(Fail(err.message))
            })
    })

    /**
     * @swagger
     * /currency:
     *   post:
     *     tags:
     *       - currency
     *     description: Adds a new allowed currency
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: body
     *         description: Currency's Entity
     *         in: body
     *         required: true
     *         type: string
     *         schema:
     *           type: object
     *           properties:
     *              abbreviation: 
     *                  type: string
     *     responses:
     *       200:
     *         description: New currency created
     *       500:
     *         description: Server could not handle response
     */
    router.post('/', (req, res, next) => {
        currencyAppService.post(req, res, next, req.body)
            .catch(err => {
                logger.error(err)
                res.status(Status.BAD_REQUEST).json(Fail(err.message))
            })
    })

    /**
     * @swagger
     * /currency:
     *   delete:
     *     tags:
     *       - currency
     *     description: Deletes an allowed currency
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Currency's id
     *         in: query
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: New currency created
     *       500:
     *         description: Server could not handle response
     */
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