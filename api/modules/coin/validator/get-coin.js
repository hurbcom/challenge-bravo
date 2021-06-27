const joi = require('joi');

module.exports = joi.object({
    ticket: joi.string().required()
});
