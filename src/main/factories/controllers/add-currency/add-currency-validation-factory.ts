import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { NumericFieldValidation } from '../../../../validation/validators/numeric-field-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { StringWithoutSpaceValidation } from '../../../../validation/validators/string-without-space-validation'
import { ValidationComposite } from '../../../../validation/validators/validiation-composite'

export const makeAddCurrencyValidation = ():Validation => {
  const validations = []
  validations.push(new RequiredFieldValidation('shortName'))
  validations.push(new StringWithoutSpaceValidation('shortName'))
  validations.push(new RequiredFieldValidation('USDvalue'))
  validations.push(new NumericFieldValidation('USDvalue'))

  return new ValidationComposite(validations)
}
