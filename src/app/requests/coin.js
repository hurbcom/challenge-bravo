const config = require('../../config');

// Campos a serem extraídos da querystring e as regras
// de verificação que deverão ser aplicadas
const fields = [
    {
        name: 'from',
        rules: ['required', 'currency']
    },
    {
        name: 'to',
        rules: ['required', 'currency']
    },
    {
        name: 'amount',
        rules: ['required', 'number']
    }
];

module.exports = {
    validate: (req, res, next) => {
        for (let field of fields) {
            value = req.query[field.name] || null;

            // Verifica se o campo existe
            if (field.rules.includes('required') && !value) {
                return res.status(400).json({
                    message: `Your must specify a '${field.name}' parameter in the querystring`
                });
            }

            // Verifica se o campo é uma moeda válida (de acordo com o array de moedas no config)
            if (
                field.rules.includes('currency') &&
                !config.currencies.includes(value.toUpperCase())
            ) {
                return res.status(422).json({
                    message: `The '${field.name}' parameter must be a valid currency`
                });
            }

            // Verifica se é um campo número
            if (field.rules.includes('number') && isNaN(value)) {
                return res.status(422).json({
                    message: `The '${field.name}' parameter must be a number`
                });
            }
        }

        next();
    },
    normalize: (req, res, next) => {
        const { from, to, amount } = req.query;
        req.query.from = from.toUpperCase();
        req.query.to = to.toUpperCase();
        // Deve ser um número de 2 casas decimais
        req.query.amount = Number(amount).toFixed(2);

        next();
    }
};
