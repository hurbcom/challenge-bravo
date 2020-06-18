const valueFormatter = require('@utils/value-formatter')
const repository = require('@utils/repositories')

module.exports = async (req, res) => {
    var { from, to, amount } = req.query
    //tornando a requisição não sensitiva
    from = from.toUpperCase()
    to = to.toUpperCase()
    //buscando informações no MongoDB
    to = await repository.find({ name: to })
    from = await repository.find({ name: from })

    if (to.length && from.length) {
        //Se existir no banco de moedas
        amount = valueFormatter(amount) // padronizando valor
        if (!amount) {
            //se padronização falhar, o valor não é um número
            res.status(400).json({ message: `Error: Value is NaN` })
        } else {
            const dollarValueBase =
                parseFloat(amount) / parseFloat(from[0].value) // colocando valor com base no dolar
            const convertedValue = String(
                dollarValueBase * parseFloat(to[0].value) //como todos os valores estão com base no dolar, basta multiplicar para converter
            )
            res.json({
                convertedValue,
                from: from[0],
                to: to[0],
                message: `Success`,
            })
        }
    } else {
        //se não encontrar no banco de moedas
        res.status(400).json({
            message: `Error: Currency is not contained in the database`,
        })
    }
}
