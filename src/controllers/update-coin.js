const valueFormatter = require('@utils/value-formatter')
const repository = require('@utils/repositories')

module.exports = async (req, res) => {
    var { name, value } = req.params
    name = name.toUpperCase()
    value = valueFormatter(value)
    if (!value) {
        res.status(400).json({ message: `Error: Value is NaN` })
    } else {
        const coin = await repository.updateById(name, value)

        res.json(coin)
    }
}
