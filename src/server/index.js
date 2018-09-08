const express = require('express')
const app = express()

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
  if (required.some(r => !params[r])) {
    res.status(400).send({ error: `required params "from", "to" and "amount"` })
  }
  res.send('vish')
}
app.get('/', controller)

/**
 * @description Inicia o servidor na porta passada via process
 * @author Felipe Rita <felipelopesrita@gmail.com>
 * @param {{ env: {} }} process
 * @returns {ExpressServer}
 */
const init = (process) => app.listen(process.env.PORT || 3000)

module.exports = Object.assign({}, {
  init,
  app
})