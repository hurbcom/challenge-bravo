const Joi = require('joi');

const conversionCurrency = {
  params: Joi.object().keys({
    from: Joi.string().required(),
    to: Joi.string().required(),
    amount: Joi.number().required(),
  }),
};

const createCurrency = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    symbol: Joi.string().required().min(3).max(4),
    rate: Joi.number().required(),
  }),
};

const deleteCurrency = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

module.exports = {
  conversionCurrency,
  deleteCurrency,
  createCurrency,
};
