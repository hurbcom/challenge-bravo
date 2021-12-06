import { InvalidParamError } from '../../presentation/errors/invalid-param-error'
import { StringWithoutSpaceValidation } from './string-without-space-validation'

describe('string without space field validation', () => {
  test('should return an invalid param error on non numeric field given', async () => {
    const sut = new StringWithoutSpaceValidation('id')
    const error = await sut.validate({ id: 'invalid string' })
    expect(error).toEqual(new InvalidParamError('id must not contain spaces'))
  })
  test('should return nothing on a valid string given', async () => {
    const sut = new StringWithoutSpaceValidation('id')
    const error = await sut.validate({ id: 'valid' })
    expect(error).toEqual(undefined)
  })
})
