/** routes.js
 * Contains common configs for routes (Like using helmet, body-parser, etc)
 * Holds info about service routes, but not the routes itself
 * */
const swaggerJSDoc = require('swagger-jsdoc')
const { Router } = require("express")
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser')
const httpLogger = require('api/currency/infrastructure/logging/http_logger')
const handleErr = require('api/currency/infrastructure/middlewares/handle_err')
const R = require('ramda')
const swaggerUI = require('swagger-ui-express')

// swagger definition
const swaggerDefinition = {
    info: {
        title: 'Currency API Explorer',
        version: '1.0.0',
        description: 'Available REST Endpoints of Currency API'
    },
    host: `${process.env.API_SWAGGER}:${process.env.PORT_SWAGGER}/api/${process.env.APP_VERSION}`,
    basePath: '/',
    securityDefinitions: {
    }
}

// options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['api/**/routes.js']
}

module.exports = ({
    config,
    logger,
    currencyFeatureRouter,
}) => {
    const router = Router()

    const apiRouter = Router()

    const swaggerSpec = swaggerJSDoc(options)

    apiRouter.use(cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }))
        .use(helmet())
        .use(bodyParser.json())
        .use(compression())

    /**
     * @swagger
     * /:
     *   get:
     *     tags:
     *       - Status
     *     description: Returns API status
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: API Status
     */
    apiRouter.get('/', (req, res) => {
        res.status(200).send('API is working :)')
    })
    apiRouter.use('/swagger.json', swaggerUI.serve, swaggerUI.setup(swaggerSpec))


    // Feature Routers here
    apiRouter.use('/currency', currencyFeatureRouter) // currency

    router.use(httpLogger(logger))
    router.use(`/api/${config.version}`, apiRouter)

    router.get('/', (req, res) => res.send(`It works, but nothing to see here.`))
    router.use(R.partialRight(handleErr, [logger, config]))

    return router;
}