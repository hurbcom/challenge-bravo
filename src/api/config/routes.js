const { Router } = require("express")
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser')
const httpLogger = require('api/currency/infrastructure/logging/http_logger')
const handleErr = require('api/currency/infrastructure/middlewares/handle_err')
const R = require('ramda')


module.exports = ({
    config,
    logger,
    currencyFeatureRouter,
}) => {
    const router = Router()

    const apiRouter = Router()

    apiRouter.use(cors({
        origin: [
            'http://localhost:3000'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }))
        .use(helmet())
        .use(bodyParser.json())
        .use(compression())

    apiRouter.get('/', (req, res) => {
        res.status(200).send('API is working :)')
    })

    // Routers here
    apiRouter.use('/currency', currencyFeatureRouter)

    router.use(httpLogger(logger))
    router.use(`/api/${config.version}`, apiRouter)
    router.get('/', (req, res) => res.send(`It works, but nothing to see here.`))
    router.use(R.partialRight(handleErr, [logger, config]))

    return router;
}