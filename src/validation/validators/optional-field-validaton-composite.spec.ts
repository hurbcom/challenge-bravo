import { Validation } from '../../presentation/controllers/protocols/validation'
import { OptionalFieldValidationComposite, MapFieldValidation } from './optional-field-validation-composite'
import { MissingParamError } from '../../presentation/errors/missing-param-error'

interface SutTypes{
  sut: OptionalFieldValidationComposite,
  validationStubs: MapFieldValidation[]
}

const makeValidation = (): Validation => {
  class ValidatioStub implements Validation {
    async validate (input: any): Promise<Error> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new ValidatioStub()
}
const makeSut = (): SutTypes => {
  const validationStubs = [{ field: 'name', validation: makeValidation() }, { field: 'email', validation: makeValidation() }]
  const sut = new OptionalFieldValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}
describe('validation composite', () => {
  test('should return an error if field given and field validation fails', async () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0].validation, 'validate').mockImplementationOnce(async () => {
      return new Promise(resolve => resolve(new MissingParamError('field')))
    })
    const error = await sut.validate({ name: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should not return an error if field not given', async () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0].validation, 'validate').mockImplementationOnce(async () => {
      return new Promise(resolve => resolve(new MissingParamError('field')))
    })
    const error = await sut.validate({ otherField: 'any_value' })
    expect(error).toBeUndefined()
  })

  test('should return the first error if more than one validation fails', async () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1].validation, 'validate').mockResolvedValueOnce(new Error())

    const error = await sut.validate({ email: 'any_value' })
    expect(error).toEqual(new Error())
  })

  test('should not return if validation succeeds', async () => {
    const { sut } = makeSut()
    const error = await sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
