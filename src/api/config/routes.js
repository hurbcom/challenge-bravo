const { Router } = require("express")
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser')
const httpLogger = require('api/shared/middlewares/http_logger')
const handleErr = require('api/shared/middlewares/handle_err')
const R = require('ramda')

const currencyFeature = require('api/currency')

module.exports = ({ config, logger }) => {
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
    apiRouter.use('/currency', currencyFeature.router)

    router.use(httpLogger(logger))
    router.use(`/api/${config.version}`, apiRouter)
    router.get('/', (req, res) => res.send(`It works, but nothing to see here.`))
    router.use(R.partialRight(handleErr, [logger, config]))

    return router;
}