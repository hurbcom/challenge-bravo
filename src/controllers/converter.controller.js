const { validationResult } = require('express-validator');
const service = require('../services/converter.service');
const { find } = require('../repositories/currencies.repository');

/**
 * Faz a conversão de moedas usando uma API externa
 * @param {Request} req
 * @param {Response} res
 */
async function convert(req, res) {
    // Validação do middleware
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        return res.status(400).send({ error: errors })
    }

    try {
        const { amount, from, to } = req.query;

        // Verificando se a moeada existe na base da dados
        const fromCurrency = await find(from);
        if (!fromCurrency) {
            res.status(404).send({ error: `Moeda de origem não encontrada na base de dados.` });
        }

        // Verificando se a moeada existe na base da dados
        const toCurrency = await find(to);
        if (!toCurrency) {
            res.status(404).send({ error: `Moeda de destino não encontrada na base de dados.` });
        }

        // Chamando o serviço de conversão
        const data = await service.convert(amount, from, to);
        res.status(200).send({ amount: data });

    } catch (e) {
        res.status(500).send({ error: `Falha ao converter moedas. [${e.message}]` });
    }
}

module.exports = {
    convert
}