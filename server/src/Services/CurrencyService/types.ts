import { TRetriveValueCoin } from 'Repository/types'

export type TConvertCoin = {
  from: string
  to: string
  amount: number
  converted: number
}

export interface ICurrencyService {
  convertCoin: (
    from: string,
    to: string,
    amount: number
  ) => Promise<TConvertCoin>

  retriveCoinsFromCacheOrService: (
    from: string,
    to: string
  ) => Promise<TRetriveValueCoin>

  retriveCoin: (coin: string) => Promise<number>

  createNewCurrency: (coinCode: string, value: number) => Promise<void>

  removeCurrency: (coinCode: string) => Promise<void>
}
