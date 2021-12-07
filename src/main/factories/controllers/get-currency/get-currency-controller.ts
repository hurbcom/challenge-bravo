import { GetCurrencyController } from '../../../../presentation/controllers/currency/get-currency-controller'
import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { makeDbGetCurrency } from '../../usecases/get-currency/db-get-currency'
import { makeDbListCurrency } from '../../usecases/list-currency/db-list-currency'

export const makeGetCurrencyController = ():Controller => {
  return new GetCurrencyController(makeDbGetCurrency(), makeDbListCurrency())
}
