// Importar Mongoose
var mongoose = require('mongoose');
let got = require('got');

const Currency = require('../models/currencyModel');
const { validationResult } = require('express-validator');

// Lista todas as moedas armazenadas
exports.findAll = function (req, res) {

    Currency.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Erro ao recuperar moedas.'
            });
        });
};

// Armazenar novas moedas
exports.create = async function (req, res) {

    const { errors } = validationResult(req);

    if(errors.length > 0) {
        return res.status(400).send({
            message: errors
        })
    }

    const currency = new Currency({
        sigla: req.body.sigla,
        nome: req.body.nome,
    });

    // Salva a moeda e checa por erros
    currency
        .save(currency)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: 
                    err.message || 'Erro ao cadastrar moeda:' + req.body.sigla
            });
        });
}

// Deletar uma moeda específica pelo ID
exports.delete = async function (req, res) {

    const id = req.params.currency_id;

    Currency.findByIdAndRemove(id)
    .then(currency => {
        if (!currency) {
            res.status(404).send({
                message: 'Não foi possível deletar a moeda com ID: '+ id + '. Talvez ela não tenha sido encontrada!'
            });
        } else {
            res.send({
                message: 'Moeda deletada com sucesso!'
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 'Erro ao deletar moeda com ID:' + id
        });
    });
};
