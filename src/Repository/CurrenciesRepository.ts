import { Redis, RequestError } from 'Utils'

export const DEFAULT_COINS = ['BRL', 'EUR', 'BTC', 'ETH'] as string[]

export const retriveCoinFromCache = async (coin: string) => {
  try {
    const redis = new Redis()

    let currencies = await redis.getRedisValue(coin)
    if (!currencies) {
      throw new RequestError('Coin not found', {}, 400)
    }

    return currencies
  } catch (error) {
    console.log('error:::', error)
    throw new RequestError('Coin not found', {}, 400)
  }
}

export const createCurrency = async (
  from: string,
  value: number
): Promise<void> => {
  const redis = new Redis()

  await redis.setRedisValue(from, value)
}

export const deleteCurrency = async (from: string): Promise<void> => {
  const redis = new Redis()

  await redis.removeRedisValue(from)
}
