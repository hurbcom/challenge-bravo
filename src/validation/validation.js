const Joi = require('joi')

const querySchema = Joi.object({
    to: Joi.string().regex(/[A-Za-z]/).max(3).required(),
    from: Joi.string().regex(/[A-Za-z]/).max(3).required(),
    amount: Joi.number().required()
})

const bodySchema = Joi.object({
    currency: Joi.string().regex(/[A-Za-z]/).max(3).required()
})

const paramSchema = Joi.object({
    id: Joi.required()
})

module.exports = { querySchema, paramSchema, bodySchema }

