const currenciesService = require("../services/currenciesService");
const joi = require("joi");

const currencyCrudSchema = joi.object().keys({
    currency: joi.string().uppercase().required().length(3),
});

const addCurrency = async (req, res) => {
    const query = req.query;
    try {
        await currencyCrudSchema.validateAsync(query, {
            convert: false,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
        return;
    }

    try {
        const response = {
            result: await currenciesService.addCurrency(query.currency),
        };

        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const removeCurrency = async (req, res) => {
    const query = req.query;

    try {
        await currencyCrudSchema.validateAsync(query, {
            convert: false,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
        return;
    }

    try {
        const response = {
            result: await currenciesService.removeCurrency(query.currency),
        };

        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const convertCurrency = async (req, res) => {
    const { from, to, amount } = req.query;

    const currencyConvertSchema = joi.object().keys({
        from: joi.string().uppercase().required().length(3),
        to: joi.string().uppercase().required().length(3),
        amount: joi
            .string()
            .required()
            .regex(new RegExp("^(?=.+)(?:[1-9]\\d*|0)?(?:\\.\\d+)?$"))
            .error(new Error("Amount must be a positive number with '.' as decimal delimiter.")),
    });

    try {
        await currencyConvertSchema.validateAsync(req.query, {
            convert: false,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
        return;
    }
    try {
        const response = {
            result: await currenciesService.convertCurrency(from, to, amount),
        };
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = { addCurrency, removeCurrency, convertCurrency };
