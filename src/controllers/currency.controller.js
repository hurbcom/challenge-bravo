const { Currency } = require("../models/currency.model");

exports.get = (req, res) => {
    var currency = req.params["currency"];

    var filter = {};

    if (currency) {
        filter = { name: currency };
    }

    Currency.find(filter, (err, currency) => {
        if (err) {
            res.status(500).send({ status: false, response: "Internal server error" });
        } else {
            if (currency && currency.length) {
                res.status(200).send({ status: true, response: currency });
            } else {
                res.status(404).send({ status: false, response: "Currency not found" });
            }
        }
    });
};

exports.post = (req, res) => {
    var data = req.body;

    Currency.findOne({ name: data.name }, (err, currency) => {
        if (err) {
            res.status(500).send({ status: false, response: "Internal server error" });
        } else {
            if (currency) {
                res.status(200).send({ status: false, response: "Currency already exists" });
            } else {
                var newCurrency = new Currency();
                newCurrency.name = data.name;

                newCurrency.save((err, savedCurrency) => {
                    if (err) {
                        res.status(500).send({ status: false, response: "Internal server error" });
                    } else {
                        res.status(200).send({ status: true, response: "Currency successfully registered" });
                    }
                });
            }
        }
    });
};

exports.delete = (req, res) => {
    var currency = req.params["currency"];

    Currency.deleteOne({ name: currency }, (err, removedCurrency) => {
        if (err) {
            res.status(500).send({ status: false, response: "Internal server error" });
        } else {
            if (removedCurrency && removedCurrency.deletedCount) {
                res.status(200).send({ status: true, response: "Currency successfully removed" });
            } else {
                res.status(404).send({ status: false, response: "Currency not found" });
            }
        }
    });
};