import { CurrencyModel } from '../../domain/models/currency'
import { UpsertCurrencyRepository } from '../protocols/db/currency/upsert-currency-repository'
import { DbUpsertCurrency } from './db-upsert-currency'

const makeFakeRepository = ():UpsertCurrencyRepository => {
  class UpsertCurrencyRepositoryStub implements UpsertCurrencyRepository {
    upsert (currency: CurrencyModel): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new UpsertCurrencyRepositoryStub()
}

const makeSut = () => {
  const repository = makeFakeRepository()
  const sut = new DbUpsertCurrency(repository)
  return { sut, repository }
}

const makeFakeCurrency = ():CurrencyModel => ({
  name: 'Test Driven Development',
  shortName: 'TDD',
  USDvalue: 500
}
)

describe('db upsert currency usecase', () => {
  test('should call repository with the right values', async () => {
    const { sut, repository } = makeSut()
    const upsertSpy = jest.spyOn(repository, 'upsert')
    await sut.upsert(makeFakeCurrency())
    expect(upsertSpy).toHaveBeenCalledWith(makeFakeCurrency())
  })
  test('should return true if repository returns true', async () => {
    const { sut } = makeSut()
    const response = await sut.upsert(makeFakeCurrency())
    expect(response).toBe(true)
  })
  test('should return false if repository returns false', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'upsert').mockResolvedValueOnce(false)
    const response = await sut.upsert(makeFakeCurrency())
    expect(response).toBe(false)
  })
  test('should throw if repository throws', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'upsert').mockRejectedValueOnce(new Error('any_error'))
    const promise = sut.upsert(makeFakeCurrency())
    await expect(promise).rejects.toThrowError('any_error')
  })
})
