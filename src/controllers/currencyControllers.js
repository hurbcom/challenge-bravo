const currencyService = require("../services/currencyServices");

const findCurrencies = async (req, res, next) => {
    try {
        let currencies = await currencyService.getCurrencies();
        res.status(200).json({ data: currencies });
    } catch (err) {
        next(err);
    }
};

const findCurrency = async (req, res, next) => {
    try {
        let { symbol } = req.params;
        let currency = await currencyService.getCurrency(symbol);
        res.status(200).json({ data: currency });
    } catch (err) {
        next(err);
    }
};

const createCurrency = async (req, res, next) => {
    try {
        let currency = await currencyService.createCurrency(req.body);
        res.status(200).json({ data: currency });
    } catch (err) {
        next(err);
    }
};

const deleteCurrency = async (req, res, next) => {
    try {
        let { symbol } = req.params;
        let currency = await currencyService.removeCurrency(symbol);
        res.status(200).json({ data: currency });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    findCurrencies,
    findCurrency,
    createCurrency,
    deleteCurrency,
};
