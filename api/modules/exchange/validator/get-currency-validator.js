const joi = require('joi');

module.exports = joi.object({
    from: joi.string().required(),
    to: joi.string().required(),
    amount: joi.number().required()
});
