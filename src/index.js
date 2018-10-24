const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000 
const router = require('./routes')

server.listen(port, () => {
  console.log(`express up on ${port}!`)
})
app.get('/', router)