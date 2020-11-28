const Currency = require('../models/currencyModel');
// Importar Mongoose
var mongoose = require('mongoose');

// Lista todos os planetas armazenados
exports.index = function (req, res) {

    Currency.get(function (err, planetas) {
        if (err) {
            res.json({
                status: "Erro!",
                message: err,
            });
        }
        res.json({
            status: "Sucesso!",
            message: "Planetas recuperados com sucesso.",
            data: planetas
        });
    });
};

// Armazenar novos planetas
exports.new = async function (req, res) {

    var sigla = req.body.sigla
    var nome = req.body.nome

    console.log('sigla> ', sigla)
    console.log('nome> ', nome)

    const currency = new Currency({
        sigla: req.body.sigla,
        nome: req.body.nome,
    });

    // Salva o planeta e checa por erros
    currency.save(function (err) {
        if (err)
            res.json(err);

        res.status(201).json({
                message: 'Nova moeda armazenada!',
                data: currency
        });
    });
}

// Deletar um planeta específico
exports.delete = function (req, res) {
    Currency.deleteOne({_id: req.params.currency_id}, function (err, planeta) {
        if (err)
            res.send(err);

    res.json({
            status: "Sucesso!",
            message: 'A moeda foi deletada com sucesso!'
        });
    });
};
