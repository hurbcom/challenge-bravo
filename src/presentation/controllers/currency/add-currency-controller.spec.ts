import { CurrencyModel } from '../../../domain/models/currency'
import { AddCurrency } from '../../../domain/usecases/add-currency'
import { BusinessRuleError } from '../../errors/business-rule-error'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../protocols/validation'
import { AddCurrencyController } from './add-currency-controller'

const makeValidation = ():Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Promise<Error> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new ValidationStub()
}

const makeAddCurrencyStub = ():AddCurrency => {
  class AddCurrencyStub implements AddCurrency {
    add (currency: CurrencyModel): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new AddCurrencyStub()
}

const makeSut = () => {
  const validation = makeValidation()
  const addCurrency = makeAddCurrencyStub()
  const sut = new AddCurrencyController(validation, addCurrency)
  return { validation, addCurrency, sut }
}

const makeFakeRequest = ():HttpRequest => ({
  body: {
    name: 'any_name',
    shortName: 'ANy',
    USDvalue: 10
  }
})

describe('add currency controller', () => {
  test('should return 400 on validation fail', async () => {
    const { validation, sut } = makeSut()
    jest.spyOn(validation, 'validate').mockResolvedValueOnce(new Error('any_error'))
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('any_error'))
  })
  test('should call addCurrency  with the right values if Validation succeeds', async () => {
    const { addCurrency, sut } = makeSut()
    const addSpy = jest.spyOn(addCurrency, 'add')
    await sut.handle(makeFakeRequest())
    // controller parses short name to upper
    expect(addSpy).toHaveBeenCalledWith({ name: 'any_name', shortName: 'ANY', USDvalue: 10 })
  })
  test('should return 201 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toEqual(201)
  })
  test('should return 202 on addCurrency returns false', async () => {
    const { sut, addCurrency } = makeSut()
    jest.spyOn(addCurrency, 'add').mockResolvedValueOnce(false)

    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toEqual(202)
  })

  test('should return 400 on addCurrency throw business error', async () => {
    const { sut, addCurrency } = makeSut()
    jest.spyOn(addCurrency, 'add').mockRejectedValueOnce(new BusinessRuleError('any'))

    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toEqual(400)
  })

  test('should return 500 on any other error', async () => {
    const { sut, addCurrency } = makeSut()
    jest.spyOn(addCurrency, 'add').mockRejectedValueOnce(new Error('any'))

    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toEqual(500)
  })
})
