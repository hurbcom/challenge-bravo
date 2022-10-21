import Joi from 'joi'

export const ValidateGetCurrencyByParameter = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  amount: Joi.string().required()
})

export const ValidateCreateCurrency = Joi.object({
  from: Joi.string().required(),
  value: Joi.number().required()
})
