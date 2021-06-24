import Schema from '../../libs/Schema';

const currency = async (req, res, next) => {
    const currencyDTO = req.body;
    const currencySchema = Schema.generateCurrencySchema();

    try {
        await Schema.validate(currencySchema, currencyDTO);

        next();
    } catch (err) {
        return res.status(400).json({ message: 'invalid params', data: { errors: err.errors }});
    }
};

export { currency };