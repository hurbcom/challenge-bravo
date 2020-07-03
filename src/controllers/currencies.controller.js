const { validationResult } = require('express-validator');
const { findAll, find, save, remove, } = require('../repositories/currencies.repository');

/**
 * Lista todas as moedas cadastradas na base de dados
 * @param {Request} req
 * @param {Response} res
 */
async function listCurrencies(req, res) {
    try {
        const data = await findAll();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ error: 'Falha ao carregar moeda.' });
    }
}

/**
 * Lista a moeda pelo código
 * @param {Request} req
 * @param {Response} res
 */
async function getCurrency(req, res) {
    try {
        const data = await find(req.params.code);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ error: 'Falha ao carregar moedas.' });
    }
}

/**
 * Salva a moeda na base dados
 * @param {Request} req
 * @param {Response} res
 */
async function createCurrency(req, res) {
    // Validação do middleware
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        return res.status(400).send({ error: errors })
    }

    try {
        const { code, name } = req.body;
        await save({ code, name });

        res.status(204).send();
    } catch (e) {
        res.status(500).send({ error: `Falha ao cadastrar moeda. [${e.message}]` });
    }
}

/**
 * Remove a moeda da base de dados pelo código
 * @param {Request} req
 * @param {Response} res
 */
async function deleteCurrency(req, res) {
    try {
        await remove(req.params.code);
        res.status(204).send();
    } catch (e) {
        res.status(500).send({ error: `Falha ao remover moeda. [${e.message}]` });
    }
}

module.exports = {
    listCurrencies,
    getCurrency,
    createCurrency,
    deleteCurrency
}