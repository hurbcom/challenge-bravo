import { CurrenciesRepository } from 'Repository/CurrenciesRepository'
import { TRetriveValueCoin } from 'Repository/types'
import { TRequestCoin } from 'Services/CoinBase/types'
import { RequestError } from 'Utils'
import { ICurrencyService, TConvertCoin } from './types'

export class CurrencyService implements ICurrencyService {
  private DEFAULT_COINS = ['BRL', 'EUR', 'BTC', 'ETH'] as string[]
  private DOLAR_TO_DOLAR = 1

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
    const { fromQuotation, toQuotation } =
      await this.retriveCoinsFromCacheOrService(from, to)

    const converted = amount * fromQuotation * toQuotation

    return {
      from,
      to,
      amount,
      converted: +converted.toFixed(4)
    }
  }

  retriveCoinsFromCacheOrService = async (
    from: string,
    to: string
  ): Promise<TRetriveValueCoin> => {
    try {
      const data = {
        fromQuotation: this.DOLAR_TO_DOLAR,
        toQuotation: this.DOLAR_TO_DOLAR
      }

      if (from !== 'USD') {
        data.fromQuotation = await this.retriveCoin(from)
      }

      if (to !== 'USD') {
        const toCurrencyCache = await this.retriveCoin(to)
        data.toQuotation = this.DOLAR_TO_DOLAR / toCurrencyCache
      }

      return data
    } catch (error) {
      console.log('error:::', error)
      throw error
    }
  }

  retriveCoin = async (coin: string): Promise<number> => {
    try {
      const coinCache = await this.currencyRepository.retriveCoinFromCache(coin)

      if (coinCache) {
        return coinCache.value
      }

      const coinRequested = await this.requestCoin(coin)
      this.createNewCurrency(coin, coinRequested)

      return coinRequested
    } catch (error) {
      throw new RequestError('Coin does not exist!', {}, 400)
    }
  }

  createNewCurrency = async (
    coinCode: string,
    value: number
  ): Promise<void> => {
    const coinCache = await this.currencyRepository.retriveCoinFromCache(
      coinCode
    )

    if (coinCache) {
      throw new RequestError('Coin already created!', {}, 400)
    }

    await this.currencyRepository.setCurrency(coinCode, {
      name: coinCode,
      value: value,
      requiredBySystem: this.DEFAULT_COINS.includes(coinCode)
    })
  }

  updateCurrency = async (coinCode: string, value: number): Promise<void> => {
    const coinCache = await this.currencyRepository.retriveCoinFromCache(
      coinCode
    )

    if (!coinCache) {
      throw new RequestError('Coin not found!', {}, 400)
    }

    await this.currencyRepository.setCurrency(coinCode, {
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
