import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { NumericFieldValidation } from '../../../../validation/validators/numeric-field-validation'
import { MapFieldValidation, OptionalFieldValidationComposite } from '../../../../validation/validators/optional-field-validation-composite'
import { StringWithoutSpaceValidation } from '../../../../validation/validators/string-without-space-validation'

export const makeUpdateCurrencyValidation = (): Validation => {
  const validations: MapFieldValidation[] = []
  validations.push({ field: 'USDvalue', validation: new NumericFieldValidation('USDvalue') })
  validations.push({ field: 'shortName', validation: new StringWithoutSpaceValidation('shortName') })

  return new OptionalFieldValidationComposite(validations)
}
