const joi = require('joi');

module.exports = joi.object({
    ticket: joi.string().required(),
    newTicket: joi.string().optional(),
    currency: joi.number().optional(),
});
