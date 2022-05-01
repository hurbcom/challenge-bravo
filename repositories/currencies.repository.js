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

exports.retrieveCurrencyByCode = async (code) => (await Currencies.find({ code }, '-_id -__v'))[0];

exports.deleteCurrency = async (code) => Currencies.deleteOne({ code });
