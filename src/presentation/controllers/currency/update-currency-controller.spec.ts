import { CurrencyModel } from '../../../domain/models/currency'
import { UpdateCurrency } from '../../../domain/usecases/update-currency'
import { BusinessRuleError } from '../../errors/business-rule-error'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../protocols/validation'
import { UpdateCurrencyController } from './update-currency-controller'

const makeValidation = ():Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Promise<Error> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new ValidationStub()
}

const makeUpdateCurrencyStub = ():UpdateCurrency => {
  class UpdateCurrencyStub implements UpdateCurrency {
    update (shortName: string, currency: CurrencyModel): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new UpdateCurrencyStub()
}

const makeSut = () => {
  const validation = makeValidation()
  const updateCurrency = makeUpdateCurrencyStub()
  const sut = new UpdateCurrencyController(validation, updateCurrency)
  return { validation, updateCurrency, sut }
}

const makeFakeRequest = ():HttpRequest => ({
  params: {
    shortName: 'ANY'
  },
  body: {
    name: 'any_name',
    shortName: 'ANy',
    USDvalue: 10
  }
})

describe('update currency controller', () => {
  test('should return 400 on validation fail', async () => {
    const { validation, sut } = makeSut()
    jest.spyOn(validation, 'validate').mockResolvedValueOnce(new Error('any_error'))
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('any_error'))
  })
  test('should call updateCurrency  with the right values if Validation succeeds', async () => {
    const { updateCurrency, sut } = makeSut()
    const updateSpy = jest.spyOn(updateCurrency, 'update')
    await sut.handle(makeFakeRequest())
    // controller parses short name to upper
    expect(updateSpy).toHaveBeenCalledWith('ANY', { name: 'any_name', shortName: 'ANY', USDvalue: 10 })
  })
  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toEqual(200)
  })
  test('should return 202 on updateCurrency returns false', async () => {
    const { sut, updateCurrency } = makeSut()
    jest.spyOn(updateCurrency, 'update').mockResolvedValueOnce(false)

    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toEqual(202)
  })

  test('should return 400 on updateCurrency throw business error', async () => {
    const { sut, updateCurrency } = makeSut()
    jest.spyOn(updateCurrency, 'update').mockRejectedValueOnce(new BusinessRuleError('any'))

    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toEqual(400)
  })

  test('should return 500 on any other error', async () => {
    const { sut, updateCurrency } = makeSut()
    jest.spyOn(updateCurrency, 'update').mockRejectedValueOnce(new Error('any'))

    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toEqual(500)
  })
})
