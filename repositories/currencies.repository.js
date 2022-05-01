const Currencies = require('../models/currencies.model');

exports.createCurrency = async (data) => {
    const currency = new Currencies(data);
    return currency.save();
};

exports.validateCurrency = (data) => {
    const currency = new Currencies(data);
    const validation = currency.validateSync();
    if (validation) throw validation;
};

exports.listCurrencies = async () => Currencies.find({}, '-_id -__v');

exports.retrieveCurrencyByCode = async (code) => Currencies.find({ code }, '-_id -__v');
