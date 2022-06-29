const Currency = require("../models/currency");

module.exports = {
    getCurrencies(req, res, next) {
        Currency.get()
            .then((data) =>
                res.status(200).json({ success: true, currency: data })
            )
            .catch((err) => res.status(400).json({ err }));
    },
};
