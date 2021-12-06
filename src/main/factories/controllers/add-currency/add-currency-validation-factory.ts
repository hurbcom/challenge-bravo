import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../validation/validators/validiation-composite'

export const makeAddCurrencyValidation = ():Validation => {
  const validations = []
  validations.push(new RequiredFieldValidation('shortName'))
  validations.push(new RequiredFieldValidation('USDvalue'))
  return new ValidationComposite(validations)
}
