import Schema from '../../libs/Schema';

const currency = async (req, res, next) => {
    const currencyDTO = req.body;
    const currencySchema = Schema.generateCurrencySchema();

    try {
        await Schema.validate(currencySchema, currencyDTO);

        next();
    } catch (err) {
        return res.sendResponse(400, 'invalid params', { errors: err.errors });
    }
};

export { currency };