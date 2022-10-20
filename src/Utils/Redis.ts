import { createClient, RedisClientType } from 'redis'

let client = null as any

export const initRedisConnection = async () => {
  client = createClient({
    url: process.env.REDIS_URL_CONNECTION
  })

  client.on('error', (err: Error) => {
    console.log('Redis Client Error:::', err)

    throw err
  })

  await client.connect()
}

export const setRedisValue = async (key: string, value: number) => {
  await client.set(key, value)
}

export const getRedisValue = async (key: string): Promise<number | null> => {
  const data = await client.get(key)

  if (!data) {
    return null
  }

  return data
}

export const removeRedisValue = async (key: string): Promise<void> => {
  await client.del(key)
}
