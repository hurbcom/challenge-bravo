const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');


const app = express();
const router = express.Router();

//conexao com o banco de dados MongoDB Atlas
mongoose.connect(config.connectionString);

//models
const Moeda = require('./models/moeda');

//rotas


const popularbancoRoute = require('./routes/popular-banco-controller');
const gestaomoedaRoute = require('../src/routes/gestao-moeda-route');
const converteRoute = require('../src/routes/converter-moeda-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

/**
 * Rota: /convertmoeda
 * description:essa rota é responsável por realizar a conversão de moeda através da string:?from=BTC&to=EUR&amount=123.45
 * GET convertemoeda/?from=BTC&to=ETH&amount=123.45;
 */
app.use('/convertemoeda', converteRoute)

/**
* Rota: /gestaomoeda
* description:essa rota é responsável por inserir, listar ou deletar moedas
* POST /convertemoeda:
*      {moeda:'BRL', cotacaodolar:'5.64'} 
* GET /convertmoeda: lista todas as moedas
* DELETE /convertmoeda/?moeda=BRL: remove a moeda especificada na url
 */
app.use('/gestaomoeda', gestaomoedaRoute);

/**
 * Rota: /
 * description:essa rota é responsável por popular o banco com cotações atualizadas consumidas de uma api externa
 * GET /: popula o banco de dados 
 */
app.use('/', popularbancoRoute);


module.exports = app;
