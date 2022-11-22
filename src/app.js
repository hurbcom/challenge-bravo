const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./src/swagger.yaml')
const routers = require('./routes')

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
app.use('/quotation', routers.quotation)
app.use('/converter', routers.converter)

module.exports = app
