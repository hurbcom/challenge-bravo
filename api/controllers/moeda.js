'use strict';

// Imports
const models = require('../models');
const helpers = require('../helpers/functions.js');
const error_handler = require('../helpers/error-handler.js');


// Controller models
const Moeda = models.Moeda;

// Controller interface
module.exports = {
    moedaListar: listar,
    moedaExibir: exibir,
    moedaInserir: inserir,
    moedaAtualizar: atualizar,
    moedaRemover: remover
};

// Controller methods
function listar(request, response) {
    (async () => {
        var filtros = resgatar_filtros(request);
                return Moeda.findAll(filtros)
                    .then(registros => helpers.response_array_list(registros, response))
                    .catch(error => error_handler.controller(error, response));
    })();
}

function exibir(request, response) {
    (async () => {
        var moeda_id = helpers.get_request_parameter(request, 'moeda_id');
        return Moeda.findByPk(moeda_id)
                    .then(registro => helpers.response_register(registro, response))
                    .catch(error => error_handler.controller(error, response));
    })();
}

function inserir(request, response) {
    (async () => {
        var body = helpers.get_request_parameter(request, 'body');
        
        return Moeda.create(body)
                    .then(registro => response.status(201).send(registro))
                    .catch(error => error_handler.controller(error, response));
    })();
}

function atualizar(request, response) {
    (async () => {
        var moeda_id = helpers.get_request_parameter(request, 'moeda_id');
        var registro = await Moeda.findByPk(moeda_id);

        // Verificar existência do registro        
        if(!registro)
            return response.status(404).send(('Moeda não encontrada'));

        var body = helpers.get_request_parameter(request, 'body');
        
        return registro.update(body)
                       .then(() => response.json({ nome: body.nome, moeda_lastro: body.moeda_lastro }))
                       .catch(error => error_handler.controller(error, response));
    })();
}

function remover(request, response) {
    (async () => {
        var moeda_id = helpers.get_request_parameter(request, 'moeda_id');
        var registro = await Moeda.findByPk(moeda_id);
        
        // Verificar existência do registro
        if(!registro)
            return response.status(404).send(('Moeda não encontrada'));

        return registro.destroy()
                       .then(() => response.status(200).send('Registro removido'))
                       .catch(error => error_handler.controller(error, response));
    })();
}

// Controller support methods
function resgatar_filtros(request) {
    var filtros = helpers.init_search_filter();

    // Ordenação da listagem
    filtros.order = [['id', 'DESC']];

    return filtros;
}