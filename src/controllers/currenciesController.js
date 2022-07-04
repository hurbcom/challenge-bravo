const Currency = require("../models/currency");
const Exchange = require("../services/exchange");

module.exports = {
    getCurrencies(req, res, next) {
        Currency.get()
            .then((data) =>
                res.status(200).json({ success: true, currency: data })
            )
            .catch((err) => res.status(400).json({ err }));
    },

    async createCurrency(req, res, next) {
        // USE BODY PARSER TO EXTRACT DATA FROM CLIENT
        const { name, code, exchange_rate } = req.body;

        Currency.create(name, code, exchange_rate)
            .then((data) =>
                res
                    .status(201)
                    .json({ success: true, data, msg: "New currency created" })
            )
            .catch((err) => res.status(400).json({ err }));
    },

    deleteCurrency(req, res, next) {
        let id = req.params.id;

        console.log(id);

        Currency.delete(id)
            .then((data) =>
                res.status(200).json({
                    success: true,
                    data,
                    msg: `Currency #${id} deleted`,
                })
            )
            .catch((err) => res.status(400).json({ err }));
    },

    async exchangeCurrencies(req, res, next) {
        const { from, to, amount } = req.query;

        await Exchange.get(from, to, amount).then((data) => {
            const { result } = data;
            const { rate } = data.info;

            const exchangeObject = {
                from: from,
                to: to,
                amount: amount,
                exchange_rate: rate,
                result: result,
            };
            res.json({ exchangeObject });
        });
    },
};
