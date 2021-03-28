const currencyServices = require("../services/currencyServices");
const invalidCurrencyError = require("../error/types/invalidCurrencyError");

const validate = async (req, res, next) => {
    let { from, to } = req.query;

    let fromCurrency = await currencyServices.getCurrency(from);
    let toCurrency = await currencyServices.getCurrency(to);

    if (!fromCurrency || !toCurrency) {
        next(new invalidCurrencyError());
    }

    next();
};

module.exports = {
    validate,
};
