const valueFormatter = require('@utils/value-formatter')
const repository = require('@utils/repositories')

module.exports = async (req, res) => {
    var { name, value } = req.params

    name = name.toUpperCase() //tornando a requisição não sensitiva
    value = valueFormatter(value) // padronizando valor
    if (!value) {
        //se não conseguir padronizar, o valor não é um número
        res.status(400).json({ message: `Error: Value is NaN` })
    } else {
        //realizando atualização no banco de moedas
        const coin = await repository.updateById(name, value)

        res.json(coin)
    }
}
