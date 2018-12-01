/**
 * Arquivo: rate.js
 * Author: Fernanda Souza
 * Descrição: arquivo responsável por realizar consulta na API da open exchange rates
 * Referência: https://openexchangerates.org/
 * Data: 01/12/2018
 */ 

'use strict'
const converter = require('./converter');
const config = require('../../config');
const axios = require('axios');

exports.get = async (req, res) => {
    let api = config.api.url + 'latest.json?app_id=' + config.api.key + '&show_alternative=true&symbols='+ config.api.coins.toString();
    try {
        const result =  await axios.get(`${api}`);   
        let conversionResult = await converter(result.data.rates, req.query.to.toUpperCase(), req.query.from.toUpperCase(), req.query.amount);
        res.status(200).send(conversionResult);
    } catch (error) {
        res.status(error.response.data.status).json({Erro:error.response.data.message});
    }    
};