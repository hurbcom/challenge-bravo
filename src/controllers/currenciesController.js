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

        const fromCode = from.toUpperCase();
        const toCode = to.toUpperCase();

        if (fromCode === "ETH" || toCode === "ETH") {
            try {
                await Exchange.getCrypto(fromCode, toCode, amount).then(
                    (data) => {
                        const rate = data;

                        const result = amount * rate;

                        const exchangeObject = {
                            from: fromCode,
                            to: toCode,
                            amount: amount,
                            exchange_rate: rate,
                            result: result,
                        };
                        res.json({ exchangeObject });
                    }
                );
            } catch (error) {
                res.json({ error });
            }
        } else {
            try {
                await Exchange.get(fromCode, toCode, amount).then((data) => {
                    const { result } = data;
                    const { rate } = data.info;

                    const exchangeObject = {
                        from: fromCode,
                        to: toCode,
                        amount: amount,
                        exchange_rate: rate,
                        result: result,
                    };
                    res.json({ exchangeObject });
                });
            } catch (error) {
                res.json({ error });
            }
        }
    },
};
