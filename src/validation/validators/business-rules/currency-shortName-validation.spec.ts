import { CurrencyModel } from '../../../domain/models/currency'
import { GetCurrency } from '../../../domain/usecases/get-currency'
import { InvalidParamError } from '../../../presentation/errors/invalid-param-error'
import { CurrencyShortNameValidation } from './currency-shortName-validation'

const makeFakeRepository = ():GetCurrency => {
  class GetCurrencyStub implements GetCurrency {
    getByShortName (shortName: string): Promise<CurrencyModel> {
      return new Promise(resolve => resolve({ name: 'Dollar', shortName: 'USD', USDvalue: 1 }))
    }
  }
  return new GetCurrencyStub()
}

const makeSut = () => {
  const getCurrency = makeFakeRepository()
  const sut = new CurrencyShortNameValidation('shortName', getCurrency)
  return { sut, getCurrency }
}
describe('Currency shortName Validation', () => {
  test('should undefined if validaiont succeeds', async () => {
    const { sut } = makeSut()
    const error = await sut.validate({ name: 'Dollar', shortName: 'USD', USDvalue: 1 })
    expect(error).toBeFalsy()
  })
  test('should should return invalidParamError on validation fail', async () => {
    const { sut, getCurrency } = makeSut()
    jest.spyOn(getCurrency, 'getByShortName').mockResolvedValueOnce(undefined)
    const error = await sut.validate({ name: 'Euro', shortName: 'EUR', USDvalue: 0.7 })
    expect(error).toEqual(new InvalidParamError('shortName'))
  })
})
