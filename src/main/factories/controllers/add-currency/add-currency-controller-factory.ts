import { AddCurrencyController } from '../../../../presentation/controllers/currency/add-currency-controller'
import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { makeDbAddCurrency } from '../../usecases/add-currency/db-add-currency-factory'
import { makeAddCurrencyValidation } from './add-currency-validation-factory'

export const makeAddCurrencyController = ():Controller => {
  return new AddCurrencyController(makeAddCurrencyValidation(), makeDbAddCurrency())
}
