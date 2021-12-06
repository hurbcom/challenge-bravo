import { InvalidParamError } from '../../presentation/errors/invalid-param-error'
import { NumericFieldValidation } from './numeric-field-validation'

describe('numeric field validation', () => {
  test('should return an invalid param error on non numeric field given', async () => {
    const sut = new NumericFieldValidation('cpf')
    const error = await sut.validate({ cpf: 'invalid_number' })
    expect(error).toEqual(new InvalidParamError('cpf'))
  })
  test('should return an invalid param error on oversized field given', async () => {
    const sut = new NumericFieldValidation('cpf', 5)
    const error = await sut.validate({ cpf: '123456' })
    expect(error).toEqual(new InvalidParamError('cpf'))
  })
  test('should return an invalid param error on undersized field given', async () => {
    const sut = new NumericFieldValidation('cpf', 1000, 7)
    const error = await sut.validate({ cpf: '123456' })
    expect(error).toEqual(new InvalidParamError('cpf'))
  })
  test('should return undefined on valid field given', async () => {
    const sut = new NumericFieldValidation('cpf', 11, 11)
    const error = await sut.validate({ cpf: '12345678910' })
    expect(error).toBeUndefined()
  })
})
