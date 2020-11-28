const Joi = require('joi')

const bodySchema = Joi.object({
    currency: Joi.string().regex(/[A-Za-z]/).max(3).required()
})

module.exports = { bodySchema }