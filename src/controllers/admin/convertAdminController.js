let paramsFilter = require('../filters/paramsFilter');
let cacheProvider = require('../../services/cacheService').instance();
let numbersUtil = require("../../util/numbers");
let currencies = require('../../services/currenciesService');
let loadData = require('../../services/loadDataService');

exports.createRate = async (req, res, next) => {
    try {
        let currentCurrencies = Array.from(cacheProvider.get("coins", 'valid'));
        let currency = req.body.currency;

        if (currentCurrencies.includes(currency)) {
            res.status(400).json("This  currency: " + currency + " is registered");
            return;
        }
        if (paramsFilter.paramsFiltersCreate(currency)) {
            let base = cacheProvider.get("Rates", 'base');
            currencies.getRate(base, currency)

            res.status(201).json("Successful to create the currency:" + currency);
        } else {
            res.status(400).json("There is no data for this currency:" + currency);
        }
    } catch (err) {
        next(err);
    }
};


exports.getGeAll = async (req, res, next) => {
    try {
        let resp = cacheProvider.getAll()['Rates'];
        res.status(200).json(resp);
    } catch (err) {
        next(err);
    }
};

exports.updateRate = async (req, res, next) => {
    try {
        let currentCurrencies = Array.from(cacheProvider.get("coins", 'valid'));
        let currency = req.body.currency;
        if (!currentCurrencies.includes(currency)) {
            res.status(400).json("This  currency: " + currency + " is not registered");
            return;
        }
        if (paramsFilter.paramsFiltersCreate(currency)) {
            let base = cacheProvider.get("Rates", 'base');
            currencies.getRate(base, currency);

            res.status(201).json("Successful to update the currency:" + currency);
        } else {
            res.status(400).json("There is no data for this currency:" + currency);
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteCurrency = async (req, res, next) => {
    try {
        let currentCurrencies = Array.from(cacheProvider.get("coins", 'valid'));
        let currency = req.params.currency;
        if (!currentCurrencies.includes(currency)) {
            res.status(400).json("This  currency: " + currency + " is not registered");
            return;
        }
        if (paramsFilter.paramsFiltersCreate(currency)) {
            let base = cacheProvider.get("Rates", 'base');
            currencies.delete(base, currency);

            res.status(201).json("Successful to delete the currency:" + currency);
        } else {
            res.status(400).json("There is no data for this currency:" + currency);
        }
    } catch (err) {
        next(err);
    }
};