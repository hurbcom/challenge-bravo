import Joi from 'joi'

export const ValidateGetCurrencyByParameter = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  amount: Joi.number().required()
})

export const ValidateCreateCurrency = Joi.object({
  from: Joi.string().required(),
  value: Joi.number().required()
})

export const ValidateUpdateCurrency = Joi.object({
  value: Joi.number().required()
})
