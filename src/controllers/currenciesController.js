const Currency = require("../models/currency");

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
            .then(() =>
                res
                    .status(201)
                    .json({ success: true, msg: "New currency created" })
            )
            .catch((err) => res.status(400).json({ err }));
    },

    deleteCurrency(req, res, next) {
        let id = req.params.id;

        console.log(id);

        Currency.delete(id)
            .then(() =>
                res
                    .status(200)
                    .json({ success: true, msg: `Currency #${id} deleted` })
            )
            .catch((err) => res.status(400).json({ err }));
    },
};
