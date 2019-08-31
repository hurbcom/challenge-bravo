var fs = require('fs');
var currencyModel = require('../models/currency.model.js')

exports.get = (req, res, next) => {
    currencyModel.getCurrency(req, res, next)
};
exports.getByCode = (req, res, next) => {
    currencyModel.getCurrencyByCode(req, res, next)
};
exports.post = (req, res, next) => {
    currencyModel.addCurrency(req, res, next)
};
exports.delete = (req, res, next) => {
    currencyModel.removeCurrency(req, res, next)
};