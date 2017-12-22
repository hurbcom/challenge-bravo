const { body, query, validationResult } = require('express-validator/check');
const logger = require('../services/logger');
const assert = require('assert');
const accounting = require('accounting');

const getRate = (base, rates, from, to) => {
    if (!rates[base]) throw 'Não possui taxa base';
    if (!rates[from]) throw "Não possui taxa para moeda origem";
    if (![to]) throw "Não possui taxa para moeda final";
    if (from === base) return rates[to];
    if (to === base) return 1 / rates[from];
    return rates[to] * (1 / rates[from]);
};

const formatMoney = value => {
    return accounting.formatNumber(value, 2, ".", ",");
};

module.exports = app => {

    app.get('/convert', [
        query('from', 'Valor da moeda origem é obrigatório e deve ter 3 caracteres.').isLength({ min: 3, max: 3 }),
        query('to', 'Valor da moeda final é obrigatório e deve ter 3 caracteres.').isLength({ min: 3, max: 3 }),
        query('amount', 'Valor a ser convertido é obrigatório e deve ser um decimal.').isLength({ min: 1 }).isFloat()
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.info(`Encontrado erros de validação: ${errors}`);
            return res.status(422).json({ errors: errors.mapped() });
        }

        const from = req.query.from.toUpperCase();
        const to = req.query.to.toUpperCase();
        const amount = req.query.amount;

        const oxrClient = new app.server.services.OxrClient();
        oxrClient.latest((errors, request, response, object) => {
            if (errors) {
                logger.info(`Encontrado erros ao buscar as taxas: ${errors}`);
                return res.status(422).json({ errors: errors });
            }

            const rate = getRate(object.base, object.rates, from, to);
            const result = amount * rate;

            return res.format({
                html: function () {
                    res.render('home', {
                        amount: amount,
                        from: from,
                        to: to,
                        currencies: Object.keys(object.rates),
                        convertion: `Taxa: ${formatMoney(rate)} / Conversão: ${formatMoney(result)}`
                    });
                },
                json: function () {
                    res.status(200).json({
                        request: {
                            query: `/convert?from=${from}&to=${to}&amount=${amount}`,
                            amount: amount,
                            from: from,
                            to: to
                        },
                        meta: {
                            timestamp: object.timestamp,
                            rate: formatMoney(rate)
                        },
                        response: formatMoney(result)
                    })
                }
            });
        });
    });

};
