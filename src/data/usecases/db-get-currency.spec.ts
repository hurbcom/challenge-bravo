import { CurrencyModel } from '../../domain/models/currency'
import { GetCurrencyRepository } from '../protocols/db/currency/get-currency-repository'
import { DbGetCurrency } from './db-get-currency'

const makeFakeRepository = ():GetCurrencyRepository => {
  class AddCurrencyRepositoryStub implements GetCurrencyRepository {
    getByShortName (shortName: string): Promise<CurrencyModel> {
      return new Promise(resolve => resolve({ ...makeFakeCurrency(), id: 'any_id' } as CurrencyModel))
    }
  }
  return new AddCurrencyRepositoryStub()
}

const makeSut = () => {
  const repository = makeFakeRepository()
  const sut = new DbGetCurrency(repository)
  return { sut, repository }
}

const makeFakeCurrency = ():CurrencyModel => ({
  name: 'Test Driven Development',
  shortName: 'TDD',
  USDvalue: 500
}
)

describe('db get currency usecase', () => {
  test('should call repository with the right values', async () => {
    const { sut, repository } = makeSut()
    const getSpy = jest.spyOn(repository, 'getByShortName')
    await sut.getByShortName('ANY')
    expect(getSpy).toHaveBeenCalledWith('ANY')
  })
  test('should return currency if repository returns currency', async () => {
    const { sut } = makeSut()
    const response = await sut.getByShortName('ANY')
    expect(response.shortName).toEqual('TDD')
  })

  test('should return null if repository returns null', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'getByShortName').mockResolvedValueOnce(null)
    const response = await sut.getByShortName('ANY')
    expect(response).toBe(null)
  })
  test('should throw if repository throws', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'getByShortName').mockRejectedValueOnce(new Error('any_error'))
    const promise = sut.getByShortName('any')
    await expect(promise).rejects.toThrowError('any_error')
  })
})
