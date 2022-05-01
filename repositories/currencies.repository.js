const Currencies = require('../models/currencies.model');

exports.createCurrency = async (data) => {
    const currency = new Currencies(data);
    await currency.save();
};
