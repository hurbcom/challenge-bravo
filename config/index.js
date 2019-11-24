const express = require('express'),
    consign = require('consign'),
    bodyParses = require('body-parser'),
    morgan = require('morgan'),
    logger = require('../services/logger'),
    helmet = require('helmet'),
    cors = require('cors')

const app = express()

app.use(helmet())
app.use(cors())

app.disable('x-powered-by')

app.use(bodyParses.urlencoded({ extended: true }))
app.use(bodyParses.json())
app.use(morgan("common", {
    stream: {
        write: function (message) {
            logger.info(message)
        }
    }
}))

consign()
    .include('routers')
    .then('services')
    .then('persistence')
    .into(app)

module.exports = app
