const { Currency } = require("../models/currency.model");
const request = require("request");

exports.get = async function (req, res) {
    let from = req.query.from;
    let to = req.query.to;
    let amount = req.query.amount;

    if (!from || !to || !amount) {
        res.status(400).send({ status: false, response: "Invalid request" });
    } else {
        var currency_from = await verifyCurrencyExists(from);
        var currency_to = await verifyCurrencyExists(to);

        if (currency_from && currency_to) {
            var rates = await getCurrencyRates();

            if (from in rates && to in rates) {
                var rateFromUSD = 1/rates[from];
                var rateToUSD = 1/rates[to];
                var value = (rateToUSD/rateFromUSD) * amount;

                res.status(200).send({ status: true, response: { from: from, to: to, amount: amount, value: value} });
            } else {
                res.status(404).send({ status: false, response: `Currency ${(from in rates) ? to : from} doesn't exists` });
            }
        } else {
            res.status(404).send({ status: false, response: `Currency ${(from) ? to : from} doesn't exists` });
        }
    }
};

function verifyCurrencyExists(name)
{
    return new Promise((resolve, reject) => {
        Currency.findOne({ name: name }, (err, currency) => {
            if (err) {
                reject(false);
            } else {
                if (currency) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

function getCurrencyRates()
{
    return new Promise((resolve, reject) => {
        request.get("http://api.coincap.io/v2/rates", (err, res, body) => {
            var json = JSON.parse(body);

            if (!json) {
                reject(false);
            }
            var rates = [];
    
            json.data.forEach(el => {
                rates[el.symbol] = el.rateUsd;
            });
    
            resolve(rates);
        });
    });
}