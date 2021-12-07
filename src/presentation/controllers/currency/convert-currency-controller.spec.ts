import { CurrencyModel } from '../../../domain/models/currency'
import { GetCurrency } from '../../../domain/usecases/get-currency'
import { Validation } from '../protocols/validation'
import { ConvertCurrencyController } from './convert-currency-controller'
const makeValidation = ():Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Promise<Error> {
      return new Promise(resolve => resolve(undefined))
    }
  }
  return new ValidationStub()
}
const makeGetCurrency = ():GetCurrency => {
  class GetCurrencyStub implements GetCurrency {
    getByShortName (shortName: string): Promise<CurrencyModel> {
      if (shortName === 'BRL') { return new Promise(resolve => resolve({ shortName: 'BRL', USDvalue: 5.62503 })) }
      return new Promise(resolve => resolve({ shortName: 'JPY', USDvalue: 113.59209 }))
    }
  }
  return new GetCurrencyStub()
}
const makeSut = () => {
  const validation = makeValidation()
  const getCurrency = makeGetCurrency()
  const sut = new ConvertCurrencyController(validation, getCurrency)
  return { validation, getCurrency, sut }
}
describe('convert currency controller', () => {
  test('should call getCurrency twice with the right values', async () => {
    const { sut, getCurrency } = makeSut()
    const getSpy = jest.spyOn(getCurrency, 'getByShortName')
    await sut.handle({
      query: {
        from: 'BRL',
        to: 'JPY',
        ammount: 123.45
      }
    })
    expect(getSpy).toHaveBeenCalledTimes(2)
    expect(getSpy).toHaveBeenCalledWith('BRL')
    expect(getSpy).toHaveBeenCalledWith('JPY')
  })
  test('should return 400 on validation fail', async () => {
    const { sut, validation } = makeSut()
    jest.spyOn(validation, 'validate').mockResolvedValueOnce(new Error(''))
    const response = await sut.handle({
      query: {
        from: 'BRL',
        to: 'JPY',
        amount: 123.45
      }
    })
    expect(response.statusCode).toBe(400)
  })
  test('should return 200 with the right values', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      query: {
        from: 'BRL',
        to: 'JPY',
        amount: 123.45
      }
    })
    expect(response.statusCode).toBe(200)
    expect(response.body.result).toEqual(2492.95443944299)
  })
  test('should return 500 on error', async () => {
    const { sut, getCurrency } = makeSut()
    jest.spyOn(getCurrency, 'getByShortName').mockRejectedValueOnce(new Error())
    const response = await sut.handle({
      query: {
        from: 'BRL',
        to: 'JPY',
        amount: 123.45
      }
    })
    expect(response.statusCode).toBe(500)
  })
})
