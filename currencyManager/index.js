const net = require('net')
const coinmarketcap = require('./dataSource/coinmarketcap')
const fixer = require('./dataSource/fixer')
const cacheRedis = require('./cache/redis')

const startUpdate = (source, time) => {
  source.getCurrencies().then((res) => {
    console.log(res)
    cacheRedis.updateAndNotify(res)
  })
  .catch((err) => {
    console.log(err)
  })
  .finally(() => {
    setTimeout(() => {
      startUpdate(source, time)
    }, time)
  })
}

startUpdate(coinmarketcap, 10000)
/* We have only 1000 req/mo, so we need to wait a LOT */
startUpdate(fixer, (60 * 60 * 24 * 30 / 1000) * 1000)
