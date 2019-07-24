const express = require('express')
const routes = express.Router()

const controllers = require('./app/controllers')

const validateParams = (req, res, next) => {
  const { from, to, amount } = req.query
  const money = ['USD', 'BRL', 'EUR', 'BTC', 'ETH']

  if (!from) {
    return res.status(400).json({ error: 'Moeda de origem não informada' })
  }

  if (!to) {
    return res.status(400).json({ error: 'Moeda final não informada' })
  }

  if (!amount) {
    return res.status(400).json({ error: 'Valor não informado' })
  }

  if (money.indexOf(from) <= 0) {
    return res
      .status(400)
      .json({ error: `A moeda de origem informada(${from}) não é suportada` })
  }

  if (money.indexOf(to) <= 0) {
    return res
      .status(400)
      .json({ error: `A moeda de final informada(${to}) não é suportada` })
  }

  next()
}

routes.get('/', (req, res) => {
  return res
    .status(200)
    .send(
      'Informe uma url válida, <br/><br/>EX: http://localhost:3000/convert?from=BRL&to=USD&amount=100'
    )
})

routes.get('/convert', validateParams, controllers.ConvertController.convert)

module.exports = routes
