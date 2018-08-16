const http = require('http')
const url = require('url')
const currencies = require("./currency/currency")
const redis = require("redis")

const dataClient = redis.createClient(
  parseInt(process.env.REDIS_DATA_PORT) || 6379,
  process.env.REDIS_DATA_HOST || "redis")

const subClient = redis.createClient(
  parseInt(process.env.REDIS_PUBSUB_PORT) || 6379,
  process.env.REDIS_PUBSUB_HOST || "redis")

const notificationChannel = process.env.PUBSUB_CHANNEL_NAME

dataClient.keys("symbol:*", (err, keys) => {
  if (err) throw err
  console.log("keys found", keys)
  if (keys.length == 0) return
  dataClient.mget(keys, (err, result) => {
    if (err) throw err
    for (var i = 0; i < keys.length; i++) {
        var currency = keys[i].split(":")[1]
        var value = parseFloat(result[i])
        if (currency && value) {
          currencies.add(currency, value)
        }
    }
    dataClient.quit()
  })
})

subClient.on("message", (channel, message) => {
  var data = JSON.parse(message)
  console.log(data)
  currencies.add(data.currency, data.value)
})

subClient.subscribe(notificationChannel)

var server = http.createServer(function (request, response) {
  var queryData = url.parse(request.url, true).query || {};

  from = queryData.from
  to = queryData.to
  amount = queryData.amount
  if (from && to && amount) {
    result = {
      from,
      to,
      amount,
      result: currencies.convert(from, to, amount)
    }
  } else {
    result = currencies.getAll()
  }

  response.writeHead(200, {"Content-Type": "application/json"})
  response.write(JSON.stringify(result))
  response.end()
}).listen(3000)

process.on('SIGTERM', function () {
  console.log("Terminando...")
  server.close(function () {
    dataClient.quit()
    subClient.quit()
    process.exit(0)
  })
})
