const express = require('express')
const http = require('http')
require('dotenv').config()
const app = express()
const server = http.createServer(app)
const port = process.env.PORT 
const router = require('./routes')
const rateService = require('./services/rates')
const redisClient = require('./redis')

/**
 * @description Chamado para desligar o server fechando a conexão com o redis.
 * @author Leonardo Tozato <leo.muniztozato@gmail.com>
 */
const shutdown = async () => {
  if(redisClient){
    await redisClient.quit()
    process.exit(1)
  }
  setTimeout(() => {
    console.error('Could not close connection in time, forcefully shutting down')
    process.exit(1)
  }, 5000);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

server.listen(port, () => {
  console.log(`express up on ${port}!`)
})

rateService.updateRates(process.env.API_KEY)
setInterval(() => rateService.updateRates(process.env.API_KEY), 360000)

app.get('/', router)