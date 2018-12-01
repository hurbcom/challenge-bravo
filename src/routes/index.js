/**
 * Arquivo: routes/index.js
 * Author: Fernanda Souza
 * Descrição: arquivo responsável por definir os endpoints da api.
 * Exemplo: '/api/rates?from=BTC&to=EUR&amount=12'
 * Data: 01/12/2018
 */ 
'use strict'

const rate = require('../controllers/rate');
const express = require('express');
const router = express.Router();

router.use("/rates", rate.get);

module.exports = router;