import joi from 'joi'

const newCurrency = joi.object({
    name: joi.string().required(),
    code: joi.string().length(3).required(),
    rate: joi.number().positive().required(),
    type: joi.string().valid('crypto', 'fic').required()
})

export default newCurrency