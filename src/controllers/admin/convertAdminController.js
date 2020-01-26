let paramsFilter = require('../filters/paramsFilter');
let cacheProvider = require('../../services/cacheService').instance();
require("../../util/numbers");
let currencies = require('../../services/currenciesService');
require('../../services/loadDataService');

exports.createRate = async (req, res, next) => {
    let currentCurrencies = Array.from(cacheProvider.get("currencies", 'valid'));
    let currency = req.body.currency;
    let currencyIsEnable = (currentCurrencies.includes(currency));
    setData(req, currencyIsEnable, res, next, currency);
};


exports.getGeAll = async (req, res, next) => {
    try {
        let resp = cacheProvider.getAll()['Rates'];
        res.status(200).json(resp);
    } catch (err) {
        next(err);
    }
};

function setData(req, currencyIsEnable, res, next, currency) {
    try {
        if (currencyIsEnable) {
            res.status(400).json("Bad Request");
            return;
        }
        let paramsIsValid = paramsFilter.paramsFiltersCreate(currency);
        if (paramsIsValid) {
            let base = cacheProvider.get("Rates", 'base');
            switch (req.method) {
                case 'PUT':
                    currencies.addRate(base, currency);
                    break;
                case 'POST':
                    currencies.addRate(base, currency);
                    break;
                case 'DELETE':
                    currencies.delete(base, currency);
                    break;
                default:
            }
            res.status(201).json("Successful to update the currency:" + currency);
        } else {
            res.status(400).json("Bad Request");
        }
    } catch (err) {
        next(err);
    }
}

function extractedNotInListCurrenciesActive(req, res, next, currency) {
    let currentCurrencies = Array.from(cacheProvider.get("currencies", 'valid'));
    let currencyIsEnable = (!currentCurrencies.includes(currency));
    setData(req, currencyIsEnable, res, next, currency);
}

exports.updateRate = async (req, res, next) => {
    let currency = req.body.currency;
    extractedNotInListCurrenciesActive(req, res, next, currency);
};

exports.deleteCurrency = async (req, res, next) => {
    let currency = req.params.currency;
    extractedNotInListCurrenciesActive(req, res, next, currency);
};