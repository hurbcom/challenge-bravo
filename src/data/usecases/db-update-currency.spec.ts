import { CurrencyModel } from '../../domain/models/currency'
import { UpdateCurrencyRepository } from '../protocols/db/currency/update-currency-repository'
import { DbUpdateCurrency } from './db-update-currency'

const makeFakeRepository = ():UpdateCurrencyRepository => {
  class UpdateCurrencyRepositoryStub implements UpdateCurrencyRepository {
    updateByShortName (shortName:string, currency: CurrencyModel): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new UpdateCurrencyRepositoryStub()
}

const makeSut = () => {
  const repository = makeFakeRepository()
  const sut = new DbUpdateCurrency(repository)
  return { sut, repository }
}

const makeFakeCurrency = ():CurrencyModel => ({
  name: 'Test Driven Development',
  shortName: 'TDD',
  USDvalue: 500
}
)

describe('db update currency usecase', () => {
  test('should call repository with the right values', async () => {
    const { sut, repository } = makeSut()
    const upsertSpy = jest.spyOn(repository, 'updateByShortName')
    await sut.update('ANY', makeFakeCurrency())
    expect(upsertSpy).toHaveBeenCalledWith('ANY', makeFakeCurrency())
  })
  test('should return true if repository returns true', async () => {
    const { sut } = makeSut()
    const response = await sut.update('ANY', makeFakeCurrency())
    expect(response).toBe(true)
  })
  test('should return false if repository returns false', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'updateByShortName').mockResolvedValueOnce(false)
    const response = await sut.update('ANY', makeFakeCurrency())
    expect(response).toBe(false)
  })
  test('should throw if repository throws', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'updateByShortName').mockRejectedValueOnce(new Error('any_error'))
    const promise = sut.update('ANY', makeFakeCurrency())
    await expect(promise).rejects.toThrowError('any_error')
  })
})
