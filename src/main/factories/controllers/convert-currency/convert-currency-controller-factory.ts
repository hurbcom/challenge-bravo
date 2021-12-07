import { ConvertCurrencyController } from '../../../../presentation/controllers/currency/convert-currency-controller'
import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { makeDbGetCurrency } from '../../usecases/get-currency/db-get-currency'
import { makeConvertCurrencyValidation } from './convert-currency-validation-factory'

export const makeConvertCurrencyController = ():Controller => {
  return new ConvertCurrencyController(makeConvertCurrencyValidation(), makeDbGetCurrency())
}
