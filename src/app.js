const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const router = express.Router();

//conexao com o banco
mongoose.connect(config.connectionString);

//models
const Moeda = require('./models/moeda');

//rotas
const indexRoute = require('../src/routes/index-route');
const moedaRoute = require('../src/routes/gestao-moeda-route');
const converteRoute = require('../src/routes/converter-moeda-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use('/convertemoeda', converteRoute)
app.use('/gestaomoeda', moedaRoute);
app.use('/', indexRoute);

module.exports = app;
