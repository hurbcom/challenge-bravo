const { body, query } = require("express-validator");

// Middleware de validação dos parâmetros para conversão
exports.converterValidator = [
    query('from').notEmpty().withMessage("A moeda de origem deve ser informada."),
    query('from').isUppercase().withMessage("A sigla da moeda de origem deve ser digitada em maiúsculo."),
    query('to').notEmpty().withMessage("A moeda de destino deve ser informada."),
    query('to').isUppercase().withMessage("A sigla da moeda de destino deve ser digitada em maiúsculo."),
    query('amount').notEmpty().withMessage("O valor para conversão deve ser informado."),
    query('amount').isFloat({ gt: 0 }).withMessage("O valor precisa ser maior que zero.")
]