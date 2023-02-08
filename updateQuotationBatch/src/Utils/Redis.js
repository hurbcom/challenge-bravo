import { createClient } from 'redis'

export async function ConnectRedisClient() {
  const redisInstance = createClient({
    url: process.env.REDIS_URL_CONNECTION
  })

  redisInstance.on('error', (err) => {
    console.log('Redis Client Error:::', err)

    throw err
  })

  await redisInstance
    .connect()
    .then(() => console.log('Connection to redis OK'))

  return redisInstance
}

export async function SetItems(redisInstance, items) {
  await redisInstance.mSet(items)
}
