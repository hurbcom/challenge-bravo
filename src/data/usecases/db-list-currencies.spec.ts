import { CurrencyModel } from '../../domain/models/currency'
import { ListCurrencyRepository } from '../protocols/db/currency/list-currency-repository'
import { DbListCurrencies } from './db-list-currencies'

const makeFakeRepository = ():ListCurrencyRepository => {
  class ListCurrencyRepositoryStub implements ListCurrencyRepository {
    listAll (): Promise<CurrencyModel[]> {
      return new Promise(resolve => resolve([{ ...makeFakeCurrency(), id: 'any_id' }as CurrencyModel]))
    }
  }
  return new ListCurrencyRepositoryStub()
}

const makeSut = () => {
  const repository = makeFakeRepository()
  const sut = new DbListCurrencies(repository)
  return { sut, repository }
}

const makeFakeCurrency = ():CurrencyModel => ({
  name: 'Test Driven Development',
  shortName: 'TDD',
  USDvalue: 500
}
)

describe('db list currency usecase', () => {
  test('should call repository', async () => {
    const { sut, repository } = makeSut()
    const listAllSpy = jest.spyOn(repository, 'listAll')
    await sut.list()
    expect(listAllSpy).toHaveBeenCalled()
  })
  test('should return currency list if repository returns currency list', async () => {
    const { sut } = makeSut()
    const response = await sut.list()
    expect(response.length).toEqual(1)
  })

  test('should return null if repository returns null', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'listAll').mockResolvedValueOnce([])
    const response = await sut.list()
    expect(response).toEqual([])
  })
  test('should throw if repository throws', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'listAll').mockRejectedValueOnce(new Error('any_error'))
    const promise = sut.list()
    await expect(promise).rejects.toThrowError('any_error')
  })
})
