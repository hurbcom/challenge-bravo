import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { UniqueCurrencyShortNameValidation } from '../../../../validation/validators/business-rules/unique-currency-shortName-validation'
import { NumericFieldValidation } from '../../../../validation/validators/numeric-field-validation'
import { MapFieldValidation, OptionalFieldValidationComposite } from '../../../../validation/validators/optional-field-validation-composite'
import { StringWithoutSpaceValidation } from '../../../../validation/validators/string-without-space-validation'
import { ValidationComposite } from '../../../../validation/validators/validiation-composite'
import { makeDbGetCurrency } from '../../usecases/get-currency/db-get-currency'

export const makeUpdateCurrencyValidation = (): Validation => {
  const validations: MapFieldValidation[] = []
  validations.push({ field: 'USDvalue', validation: new NumericFieldValidation('USDvalue') })
  validations.push({
    field: 'shortName',
    validation: new ValidationComposite([
      new StringWithoutSpaceValidation('shortName'),
      new UniqueCurrencyShortNameValidation('shortName', makeDbGetCurrency())
    ]
    )
  })
  return new OptionalFieldValidationComposite(validations)
}
