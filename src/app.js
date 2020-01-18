const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const currencies = require('./services/currencies');


const router = express.Router();

currencies().loadRates();


//Rotas
const convert = require('./routes/convert');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use('/', convert);

//schedule
const schedule = require('./schedule/schedule');
schedule.init();

module.exports = app;

