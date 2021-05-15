const Joi = require('joi');

// Objeto para validar a criação de uma moeda
const currencyValidation = Joi.object().keys({
    name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
        "string.base": `"name" deve ser um texto`,
        "string.min": `"name" deve ter no minimo {#limit} caracteres`,
        "string.max": `"name" deve ter no máximo {#limit} caracteres`,
        "any.required": `"name" é um campo obrigatório`
    }),
    code: Joi.string()
    .alphanum()
    .min(2)
    .max(10)
    .required()
    .messages({
        "string.base": `"code" deve ser um texto`,
        "string.alphanum": `"code" deve ter apenas caracteres alfanuméricos`,
        "string.min": `"code" deve ter no minimo {#limit} caracteres`,
        "string.max": `"code" deve ter no máximo {#limit} caracteres`,
        "any.required": `"code" é um campo obrigatório`
    }),
    value: Joi.number()
    .greater(1)
    .precision(2)
    .required()
    .messages({
        "number.base": `"value" deve ser um número`,
        "number.greater": `"value" deve ser maior que {#limit}`,
        "any.required": `"value" é um campo obrigatório`
    }),
    fictional: Joi.boolean().required().messages({
        "any.required": `"fictional" é um campo obrigatório`
    }),
});

// Objeto para validar quando o envio do code for necessário
const codeValidation = Joi.object().keys({
    code: Joi.string()
    .alphanum()
    .min(2)
    .max(10)
    .required()
    .messages({
        "string.base": `"code" deve ser um texto`,
        "string.alphanum": `"code" must have only alphanumeric caracteres`,
        "string.min": `"code" deve ter no minimo {#limit} caracteres`,
        "string.max": `"code" deve ter no máximo {#limit} caracteres`,
        "any.required": `"code" é um campo obrigatório`
    })
});

// Objeto para validar quando atualiza uma moeda


const IdValidation = Joi.object().keys({
    id: Joi.number()
    .greater(0)
    .required()
    .messages({
        "number.base": `"id" deve ser um número`,
        "number.greater": `"id" deve ser maior que {#limit}`,
        "any.required": `"id" é um campo obrigatório`
    })
});




const validation ={currencyValidation,codeValidation,IdValidation}

module.exports = validation