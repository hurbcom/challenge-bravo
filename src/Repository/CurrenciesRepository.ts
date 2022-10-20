import axios from 'axios'
import RequestError from 'Utils/RequestError'
import {
  TCurrencies,
  TRequestCoin,
  TRequestCoinBody,
  TRetriveValueCoin
} from './types'

let currencies = {} as TCurrencies

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

export const retriveValueCoin = async (
  from: string,
  to: string
): Promise<TRetriveValueCoin> => {
  try {
    if (!currencies[from]) {
      const dataCoin = await requestCoin(from, 'USD')
      currencies[from] = +dataCoin.bid
    }

    if (!currencies[to]) {
      let dataCoin = 1

      if (to !== 'USD') {
        const response = await requestCoin('USD', to)
        dataCoin = +response.bid
      }

      currencies[to] = dataCoin
    }

    return {
      fromQuotation: currencies[from],
      toQuotation: currencies[to] || 1
    }
  } catch (error) {
    console.log('error:::', error)
    throw error
  }
}

export const createCurrency = (from: string, value: number): number => {
  currencies[from] = value

  return value
}

export const deleteCurrency = (from: string): void => {
  delete currencies[from]
}
