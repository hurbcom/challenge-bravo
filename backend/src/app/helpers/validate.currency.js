const Joi = require('joi');

// Objeto para validar a criação de uma moeda
const currencyValidation = Joi.object().keys({
    name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
        "string.base": `"name" should be a type of 'text'`,
        "string.min": `"name" must have at last {#limit} characters`,
        "string.max": `"name" must have at maximun {#limit} characters`,
        "any.required": `"name" is a mandatory field`
    }),
    code: Joi.string()
    .alphanum()
    .min(3)
    .max(10)
    .required()
    .messages({
        "string.base": `"code" should be a type of 'text'`,
        "string.alphanum": `"code" must have only alphanumeric characters`,
        "string.min": `"code" must have at last {#limit} characters`,
        "string.max": `"code" must have at maximun {#limit} characters`,
        "any.required": `"code" is a mandatory field`
    }),
    icon: Joi.string()
    .alphanum()
    .min(3)
    .required()
    .messages({
        "string.base": `"icon" should be a type of 'text'`,
        "string.alphanum": `"icon" must have only alphanumeric characters`,
        "string.min": `"icon" must have at last {#limit} characters`,
        "any.required": `"icon" is a mandatory field`
    }),
    value: Joi.number()
    .greater(1)
    .precision(2)
    .required()
    .messages({
        "number.base": `"value" should be a type of 'number'`,
        "number.greater": `"value" must be greather then {#limit}`,
        "any.required": `"value" is a mandatory field`
    }),
    fictional: Joi.boolean().required().messages({
        "any.required": `"value" is a mandatory field`
    }),
});

// Objeto para validar quando o envio do code for necessário
const codeValidation = Joi.object().keys({
    code: Joi.string()
    .alphanum()
    .min(3)
    .max(10)
    .required()
    .messages({
        "string.base": `"code" should be a type of 'text'`,
        "string.alphanum": `"code" must have only alphanumeric characters`,
        "string.min": `"code" must have at last {#limit} characters`,
        "string.max": `"code" must have at maximun {#limit} characters`,
        "any.required": `"code" is a mandatory field`
    })
});

// Objeto para validar quando atualiza uma moeda


const IdValidation = Joi.object().keys({
    id: Joi.number()
    .greater(0)
    .required()
    .messages({
        "number.base": `"id" should be a type of 'number'`,
        "number.greater": `"id" must be greather then {#limit}`,
        "any.required": `"id" is a mandatory field`
    })
});




const validation ={currencyValidation,codeValidation,IdValidation}

module.exports = validation