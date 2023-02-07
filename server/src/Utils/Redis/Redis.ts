import { createClient } from 'redis'
import { TSetRedisValue, IRedis } from './types'

let client = null as any
export class Redis implements IRedis {
  protected redisClient!: any

  constructor() {
    if (client) {
      this.redisClient = client
    }

    return this
  }

  initRedisConnection = async () => {
    this.redisClient = createClient({
      url: process.env.REDIS_URL_CONNECTION
    })

    await this.redisClient.connect()

    this.redisClient.on('error', (err: Error) => {
      console.log('Redis Client Error:::', err)

      throw err
    })

    client = this.redisClient
  }

  setRedisValue = async (key: string, value: string) => {
    await this.redisClient.set(key, value)
  }

  multipleSetRedisValue = async (records: TSetRedisValue) => {
    await this.redisClient.mset(records)
  }

  getRedisValue = async (key: string): Promise<string | null> => {
    const data = await this.redisClient.get(key)

    if (!data) {
      return null
    }

    return data
  }

  removeRedisValue = async (key: string): Promise<void> => {
    await this.redisClient.del(key)
  }
}
