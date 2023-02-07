import { CurrenciesRepository } from 'Repository/CurrenciesRepository'
import { TRetriveValueCoin } from 'Repository/types'
import { TRequestCoin } from 'Services/CoinBase/types'
import { RequestError } from 'Utils'
import { ICurrencyService, TConvertCoin } from './types'

export class CurrencyService implements ICurrencyService {
  private DEFAULT_COINS = ['BRL', 'EUR', 'BTC', 'ETH'] as string[]

  protected currencyRepository!: CurrenciesRepository
  protected requestCoin!: TRequestCoin

  constructor(
    _requestCoin: TRequestCoin,
    _currencyRepository: CurrenciesRepository = new CurrenciesRepository()
  ) {
    this.currencyRepository = _currencyRepository
    this.requestCoin = _requestCoin
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
        let toCurrencyCache = await this.retriveCoin(to)
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

  retriveCoin = async (coin: string): Promise<number> => {
    try {
      let coinBase: number = 0

      const coinCache = await this.currencyRepository.retriveCoinFromCache(coin)

      if (coinCache) {
        coinBase = coinCache.value
      }

      if (!coinBase) {
        coinBase = await this.requestCoin(coin)
        this.createNewCurrency(coin, coinBase)
      }

      return coinBase
    } catch (error) {
      throw new RequestError('Coin does not exist!', {}, 400)
    }
  }

  createNewCurrency = async (
    coinCode: string,
    value: number
  ): Promise<void> => {
    await this.currencyRepository.createCurrency(coinCode, {
      name: coinCode,
      value: value,
      requiredBySystem: this.DEFAULT_COINS.includes(coinCode)
    })
  }

  removeCurrency = async (coinCode: string): Promise<void> => {
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
