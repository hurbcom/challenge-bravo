const joi = require('joi');

module.exports = joi.object({
    ticket: joi.string().required(),
    currency: joi.number().required(),
});
