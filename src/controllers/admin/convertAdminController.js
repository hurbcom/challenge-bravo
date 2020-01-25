let paramsFilter = require('../filters/paramsFilter');
let cacheProvider = require('../../services/cacheService').instance();
require("../../util/numbers");
let currencies = require('../../services/currenciesService');
require('../../services/loadDataService');

exports.createRate = async (req, res, next) => {
    try {
        let currentCurrencies = Array.from(cacheProvider.get("currencies", 'valid'));
        let currency = req.body.currency;

        if (currentCurrencies.includes(currency)) {
            res.status(400).json("Bad Request! This  currency: " + currency + " is registered");
            return;
        }
        let paramsIsValid = paramsFilter.paramsFiltersCreate(currency);
        if (!paramsIsValid) {
            res.status(500).send({error: 'Something failed!'});
            return
        }
        if (paramsIsValid) {
            let base = cacheProvider.get("Rates", 'base');
            currencies.addRate(base, currency);

            res.status(201).json("Successful to create the currency:" + currency);
        } else {
            res.status(400).json("Bad Request");
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
        let currentCurrencies = Array.from(cacheProvider.get("currencies", 'valid'));
        let currency = req.body.currency;
        if (!currentCurrencies.includes(currency)) {
            res.status(400).json("Bad Request");
            return;
        }
        let paramsIsValid = paramsFilter.paramsFiltersCreate(currency);
        if (paramsIsValid) {
            let base = cacheProvider.get("Rates", 'base');
            currencies.getRate(base, currency);

            res.status(201).json("Successful to update the currency:" + currency);
        } else {
            res.status(400).json("Bad Request");
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteCurrency = async (req, res, next) => {
    try {
        let currentCurrencies = Array.from(cacheProvider.get("currencies", 'valid'));
        let currency = req.params.currency;
        if (!currentCurrencies.includes(currency)) {
            res.status(400).json("Bad Request");
            return;
        }
        let paramsIsValid = paramsFilter.paramsFiltersCreate(currency);
        if (!paramsIsValid) {
            res.status(500).send({error: 'Something failed!'});
            return
        }
        if (paramsIsValid) {
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