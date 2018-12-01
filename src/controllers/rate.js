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
    let parmsRequered = ['to','from','amount'];

    if(!parmsRequered.every((item) => req.query[item] )){
        res.status(400).json({Erro:'The ' + parmsRequered.toString() + ' parameters are required.'});
        return;
    }

    if(!config.api.coins.some((item) => item == req.query.to.toUpperCase()) || !config.api.coins.some((item) => item == req.query.from.toUpperCase())){
        res.status(401).json({Erro:'Invalid currency in parameter "to". Valid currencies: ' + config.api.coins.toString()});
        return;
    }

    if(!config.api.coins.some((item) => item == req.query.from.toUpperCase())){
        res.status(401).json({Erro:'Invalid currency in parameter "from". Valid currencies: ' + config.api.coins.toString()});
        return;
    }

    if (isNaN(req.query.amount)) {
        res.status(401).json({Erro:'amount must be numeric.'});
        return;
    }

    try {
        const result =  await axios.get(`${api}`);   
        let conversionResult = await converter(result.data.rates, req.query.to.toUpperCase(), req.query.from.toUpperCase(), req.query.amount);
        res.status(200).send(conversionResult);
    } catch (error) {
        res.status(error.response.data.status).json({Erro:error.response.data.message});
    }    
};