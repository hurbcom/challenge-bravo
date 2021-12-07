import { CurrencyModel } from '../../../domain/models/currency'
import { GetCurrency } from '../../../domain/usecases/get-currency'
import { UniqueParamError } from '../../../presentation/errors/unique-param-error'
import { UniqueCurrencyShortNameValidation } from './unique-currency-shortName-validation'

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
  const sut = new UniqueCurrencyShortNameValidation('shortName', getCurrency)
  return { sut, getCurrency }
}
describe('UniqueKey Validation', () => {
  test('should return a InvalidParamError if validation Fails', async () => {
    const { sut } = makeSut()
    const error = await sut.validate({ name: 'Dollar', shortName: 'USD', USDvalue: 1 })
    expect(error).toEqual(new UniqueParamError('shortName'))
  })
  test('should not return if validation succeeds', async () => {
    const { sut, getCurrency } = makeSut()
    jest.spyOn(getCurrency, 'getByShortName').mockResolvedValueOnce(undefined)
    const error = await sut.validate({ name: 'Euro', shortName: 'EUR', USDvalue: 0.7 })
    expect(error).toBeFalsy()
  })
})
