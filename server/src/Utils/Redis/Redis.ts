import { createClient } from 'redis'
import * as RedisMocks from '../../mocks/Redis'
import { IRedis } from './types'

let client = null as any
export class Redis implements IRedis {
  protected redisClient!: any

  constructor() {
    /* istanbul ignore next */
    if (client) {
      this.redisClient = client
    }

    if (process.env.NODE_ENV === 'test') {
      this.redisClient = RedisMocks
    }

    return this
  }

  /* istanbul ignore next */
  initRedisConnection = async () => {
    if (process.env.NODE_ENV === 'test') {
      return null
    }

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
