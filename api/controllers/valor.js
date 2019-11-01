'use strict';

// Imports
const models = require('../models');
const helpers = require('../helpers/functions.js');
const axios = require('axios'); 


// Controller models
const Moeda = models.Moeda;

// Controller interface
module.exports = {
    moedaConverter:conversor,
    listarValor: listar_valor,
    exibirValor: exibir_valor
};


function listar_valor(requisicao,resposta){
    (async () => {
        var array_names = [];
        var moedas = await Moeda.findAll();

        if(!moedas)
            return resposta.status(404).send(('Not Found'));

        moedas.forEach(index => {
            array_names.push(index.dataValues.nome);
        });

        var json = process.env.API_URL + 'live?access_key=' + process.env.API_ACCESS_KEY + '&currencies=' + array_names + '&format=1';
        
        response_api(json,resposta,false);

    })();
   
}

function exibir_valor(requisicao,resposta){
    (async () => {
        var moeda_id = helpers.get_request_parameter(requisicao, 'moeda_id');
        var registro = await Moeda.findByPk(moeda_id);
        
        if(!registro)
            return resposta.status(404).send(('Moeda não encontrada'));
        
        var moeda_nome = registro.dataValues.nome;
        var json = process.env.API_URL + 'live?access_key=' + process.env.API_ACCESS_KEY + '&currencies=' + moeda_nome + '&format=1';
        
        response_api(json,resposta,false);

    })();
   
}

function conversor(requisicao, resposta) {
    (async () => {
        var array_names = [];
        var id_moeda_origem = helpers.get_request_parameter(requisicao, 'moeda_origem');
        var valor_inserido = helpers.get_request_parameter(requisicao, 'valor');
        var id_moeda_destino = helpers.get_request_parameter(requisicao, 'moeda_destino');
        

        var nome_moeda_origem = await Moeda.findByPk(id_moeda_origem);
        var nome_moeda_destino = await Moeda.findByPk(id_moeda_destino);

        if(!nome_moeda_origem)
            return resposta.status(404).send(('Moeda não encontrada'));

        if(!nome_moeda_destino)
            return resposta.status(404).send(('Moeda não encontrada'));
        
        array_names.push(nome_moeda_origem.dataValues.nome,nome_moeda_destino.dataValues.nome);

        var json = process.env.API_URL + 'live?access_key=' + process.env.API_ACCESS_KEY + '&currencies=' + array_names + '&format=1';
        
        response_api(json,resposta,valor_inserido);

    })();
}

// Controller support methods
function response_api(json,resposta,valor_inserido){
    axios.get(json).then(function(response){
        var valores = response.data.quotes;

        if(valor_inserido){
            valores = Object.values(valores);
            valores = (valor_inserido/valores[0]) * valores[1];
        }
        return helpers.response_register(valores, resposta);
    });
}