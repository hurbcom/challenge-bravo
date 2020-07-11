const Joi = require('@hapi/joi');
const validCurrencies = require('./validCurrencies')();


const schema = Joi.object().keys({
    currency: Joi.string().required().valid(...validCurrencies)
});

class AddCurrencyValidator  {
    validate(req, res, next) {
        const { currency } = req.body;
        const errors = schema.validate({ currency });
        if (errors.error) {
            res.status(400).json({
                result: false,
                message: 'Add Currency Error',
                validation: errors.error.details,
            })
        }
        next();
    }
}

module.exports = new AddCurrencyValidator();
