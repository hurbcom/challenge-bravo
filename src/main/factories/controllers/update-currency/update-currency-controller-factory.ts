import { UpdateCurrencyController } from '../../../../presentation/controllers/currency/update-currency-controller'
import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { makeDbUpdateCurrency } from '../../usecases/update-currency/db-update-currency'
import { makeUpdateCurrencyValidation } from './update-currency-validation-factory'

export const makeUpdateCurrencyController = ():Controller => {
  return new UpdateCurrencyController(makeUpdateCurrencyValidation(), makeDbUpdateCurrency())
}
