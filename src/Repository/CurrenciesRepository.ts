import axios from 'axios'
import { getRedisValue, removeRedisValue, setRedisValue } from 'Utils/Redis'
import RequestError from 'Utils/RequestError'
import { TRequestCoin, TRequestCoinBody } from './types'

export const DEFAULT_COINS = ['BRL', 'EUR', 'BTC', 'ETH'] as string[]

const requestCoin = async (
  from: string,
  to: string
): Promise<TRequestCoinBody> => {
  try {
    const key = `${from}-${to}`
    const keyWithout = `${from}${to}`

    const response = await axios.get<TRequestCoin>(
      `https://economia.awesomeapi.com.br/json/last/${key}`
    )

    if (!response.data[keyWithout]) {
      throw new RequestError('Coin not found')
    }

    return response.data[`${keyWithout}`]
  } catch (error: any) {
    throw new RequestError('Coin not found', {}, 400)
  }
}

export const retriveCoinFromCache = async (coin: string) => {
  try {
    let currencies = await getRedisValue(coin)
    if (currencies) {
      return currencies
    }

    const currencyFrom = await requestCoin(coin, 'USD')

    await setRedisValue(coin, +currencyFrom.bid)

    return +currencyFrom.bid
  } catch (error) {
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
