const Joi = require('@hapi/joi');
const validCurrencies = require('./validCurrencies')();

const schema = Joi.object().keys({
    from: Joi.string().valid(...validCurrencies).required(),
    to: Joi.string().valid(...validCurrencies).required(),
    amount: Joi.number().required().min(0),
});

class GetConversionValidator  {
    validate(req, res, next) {
        const { from, to, amount } = req.query;
        const errors = schema.validate({ from, to, amount });
        if (errors.error) {
            res.status(400).json({
                result: false,
                message: 'Get Conversion Error',
                validation: errors.error.details,
            })
        }
        next();
    }
}

module.exports = new GetConversionValidator();
