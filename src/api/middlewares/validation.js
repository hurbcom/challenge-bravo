import Schema from '../../libs/Schema';
import Message from '../../libs/ResMessage';

const currency = async (req, res, next) => {
    const currencyDTO = req.body;
    const currencySchema = Schema.generateCurrencySchema();

    try {
        await Schema.validate(currencySchema, currencyDTO);

        next();
    } catch (err) {
        const errMessage = Message.badRequest({ error: { errors: err.errors } });

        return res.sendResponse(errMessage);
    }
};

const currencyConversion = async (req, res, next) => {
    const currencyConversionDTO = req.query;
    const currencyConversionSchema = Schema.generateCurrencyConversionSchema();
    
    try {
        await Schema.validate(currencyConversionSchema, currencyConversionDTO);

        next();
    } catch (err) {
        const errMessage = Message.badRequest({ error: { errors: err.errors } });

        return res.sendResponse(errMessage);
    }
};

export { currency, currencyConversion };