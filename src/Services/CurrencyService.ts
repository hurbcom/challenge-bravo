import axios from 'axios'
import RequestError from 'Utils/RequestError'
import { TRequestCoin, TRequestCoinBody } from './types'

export const DEFAULT_COINS = ['BRL', 'EUR', 'BTC', 'ETH'] as string[]

export const requestCoin = async (
  from: string,
  to: string
): Promise<TRequestCoinBody> => {
  try {
    const response = await axios.get<TRequestCoin>(
      `https://economia.awesomeapi.com.br/json/last/${from}-${to}`
    )

    if (!response.data[`${from}${to}`]) {
      throw new RequestError('Coin not found')
    }

    return response.data[`${from}${to}`]
  } catch (error) {
    throw new RequestError('Error on request coins')
  }
}

export const convertCoin = async (
  from: string,
  to: string,
  amount: number
): Promise<number> => {
  const data = await requestCoin(from, to)
  const bid = +data.bid

  return bid * amount
}
