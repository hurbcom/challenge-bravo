const valueFormatter = require('@utils/value-formatter')
const repository = require('@utils/repositories')

module.exports = async (req, res) => {
    var { name, value } = req.body //pegar o objeto coin do body

    name = name.toUpperCase() //colocar o name em upper case para tornar a requisição não sensitiva

    value = valueFormatter(value) //realizando verficação do valor vindo no body e formatação deste
    if (!value) {
        //se houver erro na formatação, isso indica que esse valor não é um número
        res.status(400).json({ message: `Error: Value is NaN` })
    } else {
        const coin = await repository.create(name, value) //criando moeda no banco de dados

        res.status(201).json(coin)
    }
}
