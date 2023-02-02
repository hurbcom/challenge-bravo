import { CurrenciesRepository } from 'Repository/CurrenciesRepository'
import { TRetriveValueCoin } from 'Repository/types'
import { requestCoin } from 'Services/CoinBase'
import { RequestError } from 'Utils'
import { TConvertCoin } from './types'

export class CurrencyService {
  protected currencyRepository!: CurrenciesRepository

  constructor(currency = new CurrenciesRepository()) {
    this.currencyRepository = currency
  }

  convertCoin = async (
    from: string,
    to: string,
    amount: number
  ): Promise<TConvertCoin> => {
    const { fromQuotation, toQuotation } = await this.retriveValueCoin(from, to)

    let converted = amount * fromQuotation * toQuotation

    return {
      from,
      to,
      amount,
      converted: +converted.toFixed(4)
    }
  }

  retriveValueCoin = async (
    from: string,
    to: string
  ): Promise<TRetriveValueCoin> => {
    try {
      let fromCurrency = 1
      let toCurrency = 1

      if (from !== 'USD') {
        fromCurrency = await this.retriveCoin(from)
      }

      if (to !== 'USD') {
        const toCurrencyCache = await this.retriveCoin(to)
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

  retriveCoin = async (coin: string) => {
    try {
      let coinBase: number | null = null

      const coinCache = await this.currencyRepository.retriveCoinFromCache(coin)

      if (coinCache) {
        coinBase = coinCache.value
      }

      if (!coinBase) {
        coinBase = await requestCoin(coin)
        this.createNewCurrency(coin, coinBase)
      }

      return coinBase
    } catch (error) {
      throw new RequestError('Coin does not exist!', {}, 400)
    }
  }

  createNewCurrency = async (coinCode: string, value: number) => {
    await this.currencyRepository.createCurrency(coinCode, {
      name: coinCode,
      value: value,
      requiredBySystem: false
    })
  }

  removeCurrency = async (coinCode: string) => {
    const coinCache = await this.currencyRepository.retriveCoinFromCache(
      coinCode
    )

    if (!coinCache) {
      throw new RequestError('Coin not found!', {}, 400)
    }

    if (coinCache.requiredBySystem) {
      throw new RequestError('This coin cannot be deleted!', {}, 400)
    }

    await this.currencyRepository.deleteCurrency(coinCode)
  }
}
