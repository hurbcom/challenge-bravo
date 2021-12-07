import { ListCurrencies } from '../../../../domain/usecases/list-currencies'
import { FreeCurrencyAPIService } from '../../../../infra/services/free-currency-api-service'
import { AxiosAdapter } from '../../../adapters/axios-adapter'
import env from '../../../config/env'

export const makeServiceListCurrency = (): ListCurrencies => {
  const http = new AxiosAdapter(env.freeCurrencyApiURL)
  return new FreeCurrencyAPIService(http, env.freeCurrencyApikey)
}
