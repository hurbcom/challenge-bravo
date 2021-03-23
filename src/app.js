const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const router = express.Router();

//models
const User = require('./models/moeda');

//rotas
const indexRoute = require('../src/routes/index-route');
const gestaomoedaRoute = require('../src/routes/gestao-moeda-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/', indexRoute);

module.exports = app;