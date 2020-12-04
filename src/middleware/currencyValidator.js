const { body, query } = require("express-validator");

// Middleware de validação dos dados de cadastro de moedas
exports.currencyValidator = [
    body('sigla').isIn(['USD', 'BRL', 'EUR', 'BTC', 'ETH']).withMessage("Esta moeda não é suportada pela API."),
    body('sigla').isUppercase().withMessage("A sigla da moeda deve ser digitada em maiúsculo."),
    body('sigla').isLength({ min: 3, max: 3 }).withMessage("A sigla da moeda deve possuir 3 caracteres."),
    body('nome').isLength({ min: 3, max: 100 }).withMessage("O nome da moeda precisa ter no mínimo 3 caracteres e no máximo 100.")
]