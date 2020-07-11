const Joi = require('@hapi/joi');
const validCurrencies = require('./validCurrencies')();

const schema = Joi.object().keys({
    currency: Joi.string().required().valid(...validCurrencies)
});

class DeleteCurrencyValidator  {
    validate(req, res, next) {
        const { currency } = req.params;
        const errors = schema.validate({ currency });
        if (errors.error) {
            res.status(400).json({
                result: false,
                message: 'Delete Currency Error',
                validation: errors.error.details,
            })
        }
        next();
    }
}

module.exports = new DeleteCurrencyValidator();
