const Model = require('../models/MoedasModel');
const services = require('../services/services');

exports.Create = async(req, res) => {
    try {
        let response = await Model.create(req.body);
        res.status(200).send(response);
    } catch (e) {
        res.status(400).send({ error: e });
    }
}

exports.Converter = async(req, res) => {
    try {
        let errors = [];
        let filtro;
        if (req.query) filtro = req.query;

        //VERIFICA SE INFORMOU AS MOEDAS PRA CONVERSÃO
        if (!filtro.to || !filtro.from) return res.status(400).send({ error: 'Informe as moedas' });

        //BUSCA MOEDA
        let from = await Model.find({ sigla: filtro.from });
        //BUSCA MOEDA
        let to = await Model.find({ sigla: filtro.to });

        //VERIFICA SE A MOEDA TÁ CADASTRADA
        if (!from.length) errors.push({ mensagem: `A moeda ${filtro.from} não está cadastrada.` });
        else if (!to.length) errors.push({ mensagem: `A moeda ${filtro.to} não está cadastrada.` });
        else {
            let respService = await services.ConverteMoeda({ from: from[0].sigla, to: to[0].sigla, amount: filtro.amount });
            return res.status(200).json({ original: respService, formatado: respService.toFixed(2) });
        }

        return res.status(400).send({ errors });
    } catch (e) {
        res.status(400).send({ error: e });
    }
}

exports.FindAll = async(req, res) => {
    try {
        let filtro;
        if (req.query) filtro = req.query;

        let moedas = await Model.find(filtro);
        res.status(200).send(moedas);
    } catch (e) {
        res.status(400).send({ error: e });
    }
}

exports.Remove = async(req, res) => {
    try {
        await Model.findByIdAndRemove(req.params.id);
        res.status(200).send({ mensagem: 'Registro removido com sucesso.' });
    } catch (e) {
        res.status(400).send({ error: e });
    }
}