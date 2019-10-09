const { Currency } = require("../models/currency.model");

exports.get = (req, res) => {
    var currency = req.params["currency"];

    Currency.findOne({ name: currency }, (err, currency) => {
        if (err) {
            res.status(500).send({ status: false, message: "Internal server error" });
        } else {
            if (currency) {
                res.status(200).send({ status: false, message: {name: currency.name, status: currency.status} });
            } else {
                res.status(404).send({ status: false, message: "Currency not found" });
            }
        }
    });
};

exports.post = (req, res) => {
    var data = req.body;

    Currency.findOne({ name: data.name }, (err, currency) => {
        if (err) {
            res.status(500).send({ status: false, message: "Internal server error" });
        } else {
            if (currency) {
                res.status(200).send({ status: false, message: "Currency already exists" });
            } else {
                var newCurrency = new Currency();
                newCurrency.name = data.name;
                newCurrency.status = true;

                newCurrency.save((err, savedCurrency) => {
                    if (err) {
                        res.status(500).send({ status: false, message: "Internal server error" });
                    } else {
                        res.status(200).send({ status: true, message: "Currency successfully registered" });
                    }
                });
            }
        }
    });
};