import Schema from '../../libs/Schema';
import Message from '../../libs/ResMessage';

const currency = async (req, res, next) => {
    const currencyDTO = req.body;
    const currencySchema = Schema.generateCurrencySchema();

    try {
        await Schema.validate(currencySchema, currencyDTO);

        next();
    } catch (err) {
        const errMessage = Message.badRequest({ error: err.errors });

        return res.sendResponse(errMessage);
    }
};

const currencyConvertion = async (req, res, next) => {
    const currencyConvertionDTO = req.query;
    const currencyConvertionSchema = Schema.generateCurrencyConvertionSchema();
    
    try {
        await Schema.validate(currencyConvertionSchema, currencyConvertionDTO);

        next();
    } catch (err) {
        const errMessage = Message.badRequest({ error: err.errors });

        return res.sendResponse(errMessage);
    }
};

export { currency, currencyConvertion };