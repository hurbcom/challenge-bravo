import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { CurrencyShortNameValidation } from '../../../../validation/validators/business-rules/currency-shortName-validation'
import { NumericFieldValidation } from '../../../../validation/validators/numeric-field-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../validation/validators/validiation-composite'
import { makeDbGetCurrency } from '../../usecases/get-currency/db-get-currency'

export const makeConvertCurrencyValidation = ():Validation => {
  return new ValidationComposite([
    new ValidationComposite([new RequiredFieldValidation('from'), new CurrencyShortNameValidation('from', makeDbGetCurrency())]),
    new ValidationComposite([new RequiredFieldValidation('to'), new CurrencyShortNameValidation('to', makeDbGetCurrency())]),
    new ValidationComposite([new RequiredFieldValidation('amount'), new NumericFieldValidation('amount', Infinity, 0)])
  ])
}
