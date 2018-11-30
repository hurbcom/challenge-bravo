/**
 * Arquivo: config.js
 * Author: Fernanda Souza
 * Descrição: arquivo responsável por setar as configurações iniciais do app
 * Data: 30/11/2018
 */ 

'use strict'

require('dotenv').config();

exports.express = {
  port: process.env.PORT || 3000 
}

exports.api = {
    url: process.env.OPENEXCHANGERATES_API,
    key: process.env.KEY_API,
    coins: ["USD", "BRL", "EUR", "BTC", "ETH"]
}
