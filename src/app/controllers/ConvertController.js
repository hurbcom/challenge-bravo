const axios = require('axios') // Utilizaremos o axios para fazer requisição para a api contactada

class ConvertController {
  async convert (req, res) {
    const { from, to, amount } = req.query

    const currency = await axios.get(
      `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`
    )

    // Multiplica-se o valor de retorno da api pela quantidade informada
    const response = currency.data[to] * amount

    return res.status(200).json(response)
  }
}

module.exports = new ConvertController()
