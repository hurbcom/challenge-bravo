import { getRedisValue, removeRedisValue, setRedisValue } from 'Utils/Redis'
import RequestError from 'Utils/RequestError'

export const DEFAULT_COINS = ['BRL', 'EUR', 'BTC', 'ETH'] as string[]

export const retriveCoinFromCache = async (coin: string) => {
  try {
    let currencies = await getRedisValue(coin)
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
  await setRedisValue(from, value)
}

export const deleteCurrency = async (from: string): Promise<void> => {
  await removeRedisValue(from)
}
