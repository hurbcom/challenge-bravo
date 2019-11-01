'use strict';

// Imports
const models = require('../models');
const helpers = require('../helpers/functions.js');
const moment = require('moment-timezone');
const error_handler = require('../helpers/error-handler.js');
const axios = require('axios'); 


// Controller models
const Moeda = models.Moeda;

// Controller interface
module.exports = {
    historicoListar: listar,
    historicoExibir: exibir
};

function listar(requisicao,resposta){
    (async () => {
        var array_names = [];
        
        var moedas = await Moeda.findAll();
        var data = helpers.get_request_parameter(requisicao, 'data');
        
        if(!moedas)
            return resposta.status(404).send(('Not Found'));

        // Conversão da date-timezone para date
        data = moment(data);
        data = data.tz('GMT').format('YYYY-MM-DD');

        moedas.forEach(index => {
            array_names.push(index.dataValues.nome);
        });

        var url_historico = process.env.API_URL + 'historical?access_key=' + process.env.API_ACCESS_KEY + '&date=' + data + '&currencies=' + array_names + '&format=1';

        response_api(url_historico, resposta);

    })();
   
}

function exibir(requisicao, resposta) {
    (async () => {
        var moeda;
        var data = helpers.get_request_parameter(requisicao, 'data');

        // Conversão da date-timezone para date
        data = moment(data);
        data = data.tz('GMT').format('YYYY-MM-DD');

        var moeda_id = helpers.get_request_parameter(requisicao, 'moeda_id');
        var registro = await Moeda.findByPk(moeda_id);
        
        if(!registro)
            return resposta.status(404).send(('Moeda não encontrada'));

        // Filtrando variável para receber apenas o nome da variável
        moeda = registro.dataValues.nome;

        var url_historico = process.env.API_URL + 'historical?access_key=' + process.env.API_ACCESS_KEY + '&date=' + data + '&currencies=' + moeda + '&format=1';

        response_api(url_historico, resposta);

    })();
}

// Controller support methods
function response_api(json,resposta){
    axios.get(json).then(function(response){
        var object_response = {
            date: response.data.date,
            source: response.data.source,
            quotes: response.data.quotes
        };

        return helpers.response_register(object_response, resposta);
    });
}