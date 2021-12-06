import { MissingParamError } from '../../presentation/errors/missing-param-error'
import { RequiredFieldValidation } from './required-field-validation'
const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}
describe('RequiredField Validation', () => {
  test('should return a MissngParamError if validation Fails', async () => {
    const sut = makeSut()
    const error = await sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('should not return if validation succeeds', async () => {
    const sut = makeSut()
    const error = await sut.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})
