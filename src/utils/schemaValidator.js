import Joi from 'joi'

const schemaValidatorConvert = Joi.object({
  from: Joi.string().uppercase().required(),
  to: Joi.string().uppercase().required(),
  amount: Joi.number().required()
})

const schemaValidatorRegister = Joi.object({
  code: Joi.string().required(),
  price: Joi.number().greater(0)
})

export { schemaValidatorConvert, schemaValidatorRegister }
