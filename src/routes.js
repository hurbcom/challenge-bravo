const express = require('express')
const routes = express.Router()

routes.get('/convert', (req, res) => {
  const { from, to, amount } = req.query

  res.send({ from, to, amount })
})

module.exports = routes
