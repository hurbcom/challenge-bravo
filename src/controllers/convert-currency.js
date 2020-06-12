const baseCoins = require("@utils/coin-base.json");
const valueFormatter = require("@utils/value-formatter");
module.exports = (req, res) => {
    try {
        var { from, to, amount } = req.query;

        from = from.toUpperCase();
        to = to.toUpperCase();
        amount = valueFormatter(amount);

        if (
            Object.keys(baseCoins).includes(from) &&
            Object.keys(baseCoins).includes(to)
        ) {
            const dollarValueBase =
                parseFloat(amount) / parseFloat(baseCoins[from].value);
            const convertedValue = String(
                dollarValueBase * parseFloat(baseCoins[to].value)
            );
            res.json({
                convertedValue,
                from: { name: from, ...baseCoins[from] },
                to: { name: to, ...baseCoins[to] },
                message: `Success`,
            });
        } else
            res.json({
                convertedValue: null,
                message: `Valores não encontrado no banco de moedas`,
            });
    } catch (err) {
        res.json(err);
    }
};
