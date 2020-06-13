const baseCoins = require('@utils/coin-base.json')
const valueFormatter = require('@utils/value-formatter')
module.exports = (req, res) => {
    var { from, to, amount } = req.query

    from = from.toUpperCase()
    to = to.toUpperCase()
    amount = valueFormatter(amount)

    if (
        Object.keys(baseCoins).includes(from) &&
        Object.keys(baseCoins).includes(to) &&
        amount
    ) {
        const dollarValueBase =
            parseFloat(amount) / parseFloat(baseCoins[from].value)
        const convertedValue = String(
            dollarValueBase * parseFloat(baseCoins[to].value)
        )
        res.json({
            convertedValue,
            from: { name: from, ...baseCoins[from] },
            to: { name: to, ...baseCoins[to] },
            message: `Success`,
        })
    } else if (!amount) {
        res.json({
            convertedValue: null,
            message: `Error: Amount is NaN`,
        })
    } else {
        res.json({
            convertedValue: null,
            message: `Coin not found in the coin database`,
        })
    }
}
