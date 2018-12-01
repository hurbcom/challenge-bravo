/**
 * Arquivo: app.js
 * Author: Fernanda Souza
 * Descrição: arquivo responsável por vincular middlewares de nível do aplicativo a uma instância do objeto app. 
 * Definindo '/api' como prefixo de todas as rotas definidas no arquino routes/index.
 * Data: 01/12/2018
 */ 
'use strict'

const express = require('express');
const app = express();

const apiRouter = require('./routes');
app.use('/api', apiRouter);

module.exports = app;