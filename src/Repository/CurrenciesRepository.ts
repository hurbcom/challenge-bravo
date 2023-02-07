import { Redis, RequestError } from 'Utils'
import { TCoinBase } from './types'

export class CurrenciesRepository {
  protected redisClient!: Redis

  constructor(redis: Redis = new Redis()) {
    this.redisClient = redis
  }

  retriveCoinFromCache = async (coin: string): Promise<TCoinBase | null> => {
    try {
      let currencies = await this.redisClient
        .getRedisValue(coin)
        .catch(() => null)

      if (!currencies) {
        return null
      }

      return JSON.parse(currencies) as TCoinBase
    } catch (error) {
      console.log('error:::', error)
      throw new RequestError('Coin not found', {}, 400)
    }
  }

  createCurrency = async (key: string, value: TCoinBase): Promise<void> => {
    await this.redisClient.setRedisValue(key, JSON.stringify(value))
  }

  deleteCurrency = async (from: string): Promise<void> => {
    await this.redisClient.removeRedisValue(from)
  }
}
