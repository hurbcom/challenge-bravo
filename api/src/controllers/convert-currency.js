const valueFormatter = require('@utils/value-formatter')
const repository = require('@utils/repositories')

module.exports = async (req, res) => {
    var { from, to, amount } = req.query
    console.log(from)

    from = from.toUpperCase()
    to = to.toUpperCase()

    to = await repository.find({ name: to })
    from = await repository.find({ name: from })

    if (to.length && from.length) {
        amount = valueFormatter(amount)
        console.log(amount)
        if (!amount) {
            res.status(400).json({ message: `Error: Value is NaN` })
        } else {
            console.log(
                parseFloat(from[0].value),
                parseFloat(amount),
                parseFloat(to[0].value)
            )
            const dollarValueBase =
                parseFloat(amount) / parseFloat(from[0].value)
            const convertedValue = String(
                dollarValueBase * parseFloat(to[0].value)
            )
            res.json({
                convertedValue,
                from: from[0],
                to: to[0],
                message: `Success`,
            })
        }
    } else {
        res.status(400).json({
            message: `Error: Currency is not contained in the database`,
        })
    }
}
