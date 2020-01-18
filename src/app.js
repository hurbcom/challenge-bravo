const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();
//Rotas
const convert = require('./routes/convert');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use('/', convert);

module.exports = app;

