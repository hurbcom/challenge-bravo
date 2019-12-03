//Importando as dependências do Express Framework e do BodyParser
const express = require('express');
const bodyParser = require('body-parser');

//Configurando o Express e atribuindo à variável -app-
var app = express();

//Configura o modo como será tratado nossas requisições
app.use(bodyParser.json());

//Declarando as rotas existentes na API
const converterRoutes = require('./routes/converterRoutes');
const coinsRoutes = require('./routes/coinsRoutes');

//Vinculando o link com as rotas
app.use('/converter', converterRoutes);
app.use('/coins', coinsRoutes);

module.exports = app;