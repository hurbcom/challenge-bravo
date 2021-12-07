import { DeleteCurrencyRepository } from '../protocols/db/currency/delete-currency-repository'
import { DbDeleteCurrency } from './db-delete-currency'

const makeFakeRepository = ():DeleteCurrencyRepository => {
  class DeleteCurrencyRepositoryStub implements DeleteCurrencyRepository {
    deleteByShortName (shortName: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new DeleteCurrencyRepositoryStub()
}

const makeSut = () => {
  const repository = makeFakeRepository()
  const sut = new DbDeleteCurrency(repository)
  return { sut, repository }
}

describe('db get currency usecase', () => {
  test('should call repository with the right values', async () => {
    const { sut, repository } = makeSut()
    const getSpy = jest.spyOn(repository, 'deleteByShortName')
    await sut.delete('ANY')
    expect(getSpy).toHaveBeenCalledWith('ANY')
  })
  test('should return true if repository returns true', async () => {
    const { sut } = makeSut()
    const response = await sut.delete('ANY')
    expect(response).toBe(true)
  })

  test('should return false if repository returns false', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'deleteByShortName').mockResolvedValueOnce(false)
    const response = await sut.delete('ANY')
    expect(response).toBe(false)
  })
  test('should throw if repository throws', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'deleteByShortName').mockRejectedValueOnce(new Error('any_error'))
    const promise = sut.delete('any')
    await expect(promise).rejects.toThrowError('any_error')
  })
})
