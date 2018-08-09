const http = require('http')
const url = require('url')
const currencies = require("./currency/currency")
const redis = require("redis")

const dataClient = redis.createClient(
  process.env.REDIS_DATA_POST || 6379,
  process.env.REDIS_DATA_HOST || "redis")

const subClient = redis.createClient(
  process.env.REDIS_PUBSUB_HOST || 6379,
  process.env.REDIS_PUBSUB_PORT || "redis")

const notificationChannel = process.env.PUBSUB_CHANNEL_NAME

dataClient.keys("symbol:*", (err, keys) => {
  if (err) throw err
  console.log(keys)
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

http.createServer(function (request, response) {
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
