const express = require('express')
const http = require('http')
require('dotenv').config()
const app = express()
const server = http.createServer(app)
const port = process.env.PORT 
const router = require('./routes')

server.listen(port, () => {
  console.log(`express up on ${port}!`)
})
app.get('/', router)