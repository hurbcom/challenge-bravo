const valueFormatter = require('@utils/value-formatter')
const repository = require('@utils/repositories')

module.exports = async (req, res) => {
    var { name, value } = req.body //pegar o objeto coin do body

    name = name.toUpperCase() //colocar o name em upper case para tornar a requisição não sensitiva

    value = valueFormatter(value)
    if (!value) {
        res.status(400).json({ message: `Error: Value is NaN` })
    } else {
        const coin = await repository.create(name, value)

        res.status(201).json(coin)
    }
}
