const express = require('express')
const { get, update } = require('../rates')
const fetch = require('node-fetch')
const converter = require('../converter')
const app = express()
const rates = Object
  .entries(get())
  .map(entry => entry[0])
const symbols = rates.reduce((prev, curr, index, arr) =>
  `${prev}${index < arr.lenght - 1 ? ',' : ' or'} ${curr}`, '')

/**
 * @description Rota de controle de conversão de moedas
 * @author Felipe Rita <felipelopesrita@gmail.com>
 * @param {Request} req
 * @param {Response} res
 * @returns {{ data: { value: Number } }}
 */
const controller = function (req, res) {
  let params = { ...req.query }
  let required = ['from', 'to', 'amount']
  // Verifica se falta parâmetros
  if (required.some(r => !params[r])) {
    return res.status(400).send({ error: `required params "from", "to" and "amount"` })
  }
  params.from = params.from.toUpperCase()
  params.to = params.to.toUpperCase()
  // Verifica se a moeda é valida
  if (!rates.some(rate => rate === params.from) || ! rates.some(rate => rate === params.to)) {
    res.status(400).send({ error: `Invalid currency. Currency must be ${symbols}` })
  }
  let data = converter.from(params.from).to(params.to).value(params.amount)
  res.send({ data })
}
app.get('/', controller)

/**
 * @description Inicia o servidor na porta passada via process
 * @author Felipe Rita <felipelopesrita@gmail.com>
 * @param {{ env: {} }} process
 * @returns {ExpressServer}
 */
const init = (process) => {
  update(fetch, process)
  // Timeout cotação
  setInterval(() => update(fetch, process), 360000)
  let port = process.env.PORT || 3000
  return app.listen(port, () => {
    console.log(`server listening on port :${port}`)
  })
}

module.exports = Object.assign({}, {
  init,
  app
})