import { DeleteCurrencyController } from '../../../../presentation/controllers/currency/delete-currency-controller'
import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { makeDbDeleteCurrency } from '../../usecases/delete-currency/db-delete-currency'

export const makeDeleteCurrencyController = (): Controller => {
  return new DeleteCurrencyController(makeDbDeleteCurrency())
}
