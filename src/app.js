const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./src/swagger.yaml')
const converterRouter = require('./routes/converterRouter')

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
app.use('/converter', converterRouter)

module.exports = app
