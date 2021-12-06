import { Validation } from '../../presentation/controllers/protocols/validation'
import { MissingParamError } from '../../presentation/errors/missing-param-error'
import { ValidationComposite } from './validiation-composite'

interface SutTypes{
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeValidation = (): Validation => {
  class ValidatioStub implements Validation {
    async validate (input: any): Promise<Error> {
      return null
    }
  }
  return new ValidatioStub()
}
const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}
describe('validation composite', () => {
  test('should return an error if any validation fails', async () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockImplementationOnce(async () => {
      return new Promise(resolve => resolve(new MissingParamError('field')))
    })
    const error = await sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should return the first error if more than one validation fails', async () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockResolvedValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockResolvedValueOnce(new MissingParamError('field'))

    const error = await sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })

  test('should not return if validation succeeds', async () => {
    const { sut } = makeSut()
    const error = await sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
