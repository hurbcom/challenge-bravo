import Joi from 'joi'

export const ValidateGetCurrencyByParameter = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  amount: Joi.string().required()
})
