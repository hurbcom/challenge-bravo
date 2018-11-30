
/**
 * Arquivo: config.js
 * Author: Fernanda Souza
 * Descrição: arquivo responsável por setar as configurações iniciais do app
 * Data: 30/11/2017
 */ 

'use strict'

require('dotenv').config();

exports.express = {
  port: process.env.PORT || 3000 
}
