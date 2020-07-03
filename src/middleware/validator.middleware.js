const { body, query } = require("express-validator");

module.exports = {
    currencies: [
        body('code').isLength({ min: 3, max: 3 }).withMessage("O código da moeda deve ter 3 caracteres."),
        body('code').isUppercase().withMessage("O código da moeda deve informado em caixa alta."),
        body('name').isLength({ min: 3, max: 280 }).withMessage("O nome da moeda precisa ter no mínimo 3 caracteres e no máximo 280.")
    ],
    converter: [
        query('from').notEmpty().withMessage("A moeda de origem precisa ser informada."),
        query('from').isUppercase().withMessage("A moeda de origem precisa ser informada em caixa alta."),
        query('to').notEmpty().withMessage("A moeda de destino precisa ser informada."),
        query('to').isUppercase().withMessage("A moeda de destino precisa ser informada em caixa alta."),
        query('amount').isDecimal({ gt: 0 }).withMessage("O valor precisa ser maior que 0 (zero).")
    ]
}