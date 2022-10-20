import { retriveCoinFromCache } from 'Repository/CurrenciesRepository'
import { TRetriveValueCoin } from 'Repository/types'
import { getRedisValue } from 'Utils/Redis'
import { TConvertCoin } from './types'

export const retriveValueCoin = async (
  from: string,
  to: string
): Promise<TRetriveValueCoin> => {
  try {
    let fromCurrency = 1
    let toCurrency = 1

    if (from !== 'USD') {
      fromCurrency = await retriveCoinFromCache(from)
    }

    if (to !== 'USD') {
      const toCurrencyCache = await retriveCoinFromCache(to)
      toCurrency = 1 / toCurrencyCache
    }

    return {
      fromQuotation: fromCurrency,
      toQuotation: toCurrency
    }
  } catch (error) {
    console.log('error:::', error)
    throw error
  }
}

export const convertCoin = async (
  from: string,
  to: string,
  amount: number
): Promise<TConvertCoin> => {
  const data = await retriveValueCoin(from, to)

  let converted = amount * data.fromQuotation * data.toQuotation

  return {
    from,
    to,
    amount,
    converted: +converted.toFixed(4)
  }
}

export const populateCache = async (): Promise<void> => {
  const defaultCoins = ['BRL', 'EUR', 'BTC', 'ETH']

  const currenciesInCache = await Promise.all(
    defaultCoins.map((coin) => getRedisValue(coin))
  )

  if (currenciesInCache.some((currentValue) => !currentValue)) {
    await Promise.all(defaultCoins.map((coin) => retriveCoinFromCache(coin)))
  }
}
