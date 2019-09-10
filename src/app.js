'use strict'

// carregamento do módulo express e rotas
const express = require('express');
const app = express();

// carregamento da biblioteca body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: false }));

//carregando todas as rotas
const moedaRoute = require('./routes/moedas-route');
const convertRoute = require('./routes/convert-route');
app.use('/moedas', moedaRoute);
app.use('/convert', convertRoute);

//carregando o app
module.exports = app;
