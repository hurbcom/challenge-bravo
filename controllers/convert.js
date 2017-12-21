var logger = require('../services/logger.js');
var assert = require('assert');
var accounting = require('accounting');

var checkQueries = function (req) {
    req.checkQuery('from', 'Valor da moeda origem é obrigatório.').notEmpty();
    req.checkQuery('from', 'Valor da moeda origem deve ter 3 caracteres.').len(3, 3);

    req.checkQuery('to', 'Valor da moeda final é obrigatório.').notEmpty();
    req.checkQuery('to', 'Valor da moeda final deve ter 3 caracteres.').len(3, 3);

    req.checkQuery('amount', 'Valor a ser convertido é obrigatória.').notEmpty();
    req.checkQuery('amount', 'Valor a ser convertido deve ser um decimal.').isFloat();
}

var getRate = function (base, rates, from, to) {
    if (!rates[base]) throw 'Não possui taxa base';
    if (!rates[from]) throw "Não possui taxa para moeda origem";
    if (![to]) throw "Não possui taxa para moeda final";
    if (from === base) return rates[to];
    if (to === base) return 1 / rates[from];
    return rates[to] * (1 / rates[from]);
};

var formatMoney = function (value) {
    return accounting.formatNumber(value, 2, ".", ",");
}

module.exports = function (app) {

    app.get('/convert', function (req, res) {
        checkQueries(req);

        var errors = req.validationErrors();
        if (errors) {
            logger.info(`Encontrado erros de validação: ${erros}`);
            res.status(400).send(errors);
            return;
        }

        let from = req.query.from;
        let to = req.query.to;
        let amount = req.query.amount;

        let oxrClient = new app.services.OxrClient();
        oxrClient.latest(function (error, request, response, object) {
            assert.ifError(error);

            let rate = getRate(object.base, object.rates, from, to);
            let result = amount * rate;

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
            });
            return;
        });
    });

};
