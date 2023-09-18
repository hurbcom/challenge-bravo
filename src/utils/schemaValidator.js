import Joi from 'joi'

const schemaValidatorConvert = Joi.object({
  from: Joi.string().uppercase().required(),
  to: Joi.string().uppercase().required(),
  amount: Joi.number().required()
})

export { schemaValidatorConvert }
