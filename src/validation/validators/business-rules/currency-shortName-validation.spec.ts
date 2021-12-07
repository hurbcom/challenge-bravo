import { GetCurrencyRepository } from '../../../data/protocols/db/currency/get-currency-repository'
import { CurrencyModel } from '../../../domain/models/currency'
import { InvalidParamError } from '../../../presentation/errors/invalid-param-error'
import { CurrencyShortNameValidation } from './currency-shortName-validation'

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
  const sut = new CurrencyShortNameValidation('shortName', repository)
  return { sut, repository }
}
describe('Currency shortName Validation', () => {
  test('should undefined if validaiont succeeds', async () => {
    const { sut } = makeSut()
    const error = await sut.validate({ name: 'Dollar', shortName: 'USD', USDvalue: 1 })
    expect(error).toBeFalsy()
  })
  test('should should return invalidParamError on validation fail', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'getByShortName').mockResolvedValueOnce(undefined)
    const error = await sut.validate({ name: 'Euro', shortName: 'EUR', USDvalue: 0.7 })
    expect(error).toEqual(new InvalidParamError('shortName'))
  })
})
