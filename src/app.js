const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

app.use(express.urlencoded({ extended: false }))

module.exports = app
