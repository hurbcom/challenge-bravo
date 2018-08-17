const redis = require("redis")

const dataClient = redis.createClient(
  parseInt(process.env.REDIS_DATA_PORT) || 6379,
  process.env.REDIS_DATA_HOST || "redis")

const pubClient = redis.createClient(
  parseInt(process.env.REDIS_PUBSUB_PORT) || 6379,
  process.env.REDIS_PUBSUB_HOST || "redis")

const notificationChannel = process.env.PUBSUB_CHANNEL_NAME

const onError = (err) => {
  console.log("Error " + err)
}

dataClient.on("error", onError)
pubClient.on("error", onError)

module.exports = {
  updateAndNotify: (currencies) => {
    console.log("updateAndNotify")
    currencies.forEach((item) => {
      dataClient.get("symbol:"+ item.currency, (err, result) => {
          if(err) throw err
          if (item.value != parseFloat(result)) {
            dataClient.set("symbol:"+ item.currency, item.value)
            pubClient.publish(notificationChannel, JSON.stringify(item))
          }
      })
    })
  }
}

process.on('SIGTERM', function () {
  console.log("Terminando...")
  dataClient.quit()
  pubClient.quit()
  process.exit(0)
})
