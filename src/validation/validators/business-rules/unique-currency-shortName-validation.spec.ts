import { GetCurrencyRepository } from '../../../data/protocols/db/currency/get-currency-repository'
import { CurrencyModel } from '../../../domain/models/currency'
import { UniqueParamError } from '../../../presentation/errors/unique-param-error'
import { UniqueCurrencyShortNameValidation } from './unique-currency-shortName-validation'

const makeFakeRepository = ():GetCurrencyRepository => {
  class GetCurrencyRepositoryStub implements GetCurrencyRepository {
    getByShortName (shortName: string): Promise<CurrencyModel> {
      return new Promise(resolve => resolve({ name: 'Dollar', shortName: 'USD', USDvalue: 1 }))
    }
  }
  return new GetCurrencyRepositoryStub()
}

const makeSut = () => {
  const repository = makeFakeRepository()
  const sut = new UniqueCurrencyShortNameValidation('shortName', repository)
  return { sut, repository }
}
describe('UniqueKey Validation', () => {
  test('should return a InvalidParamError if validation Fails', async () => {
    const { sut } = makeSut()
    const error = await sut.validate({ name: 'Dollar', shortName: 'USD', USDvalue: 1 })
    expect(error).toEqual(new UniqueParamError('shortName'))
  })
  test('should not return if validation succeeds', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'getByShortName').mockResolvedValueOnce(undefined)
    const error = await sut.validate({ name: 'Euro', shortName: 'EUR', USDvalue: 0.7 })
    expect(error).toBeFalsy()
  })
})
