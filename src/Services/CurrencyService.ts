import { retriveValueCoin } from 'Repository/CurrenciesRepository'
import { TConvertCoin } from './types'

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
    converted: converted
  }
}
