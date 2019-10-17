const { Currency } = require("../models/currency.model");
const request = require("request");

exports.get = async function (req, res) {
    let from = req.query.from;
    let to = req.query.to;
    let amount = req.query.amount;

    if (!from || !to || !amount) {
        res.status(400).send({ status: false, response: "Invalid request" });
    } else {
        let currency_from = await verifyCurrencyExists(from);
        let currency_to = await verifyCurrencyExists(to);

        if (currency_from && currency_to) {
            // request.get("http://api.coincap.io/v2/rates", (err, res, body) => {
            //     console.log(body);
            // });
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