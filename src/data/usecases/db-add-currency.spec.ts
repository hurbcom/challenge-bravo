import { CurrencyModel } from '../../domain/models/currency'
import { AddCurrencyRepository } from '../protocols/db/currency/add-currency-repository'
import { DbAddCurrency } from './db-add-currency'

const makeFakeRepository = ():AddCurrencyRepository => {
  class AddCurrencyRepositoryStub implements AddCurrencyRepository {
    add (currency: CurrencyModel): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new AddCurrencyRepositoryStub()
}

const makeSut = () => {
  const repository = makeFakeRepository()
  const sut = new DbAddCurrency(repository)
  return { sut, repository }
}

const makeFakeCurrency = ():CurrencyModel => ({
  name: 'Test Driven Development',
  shortName: 'TDD',
  USDvalue: 500
}
)

describe('db add currency usecase', () => {
  test('should call repository with the right values', async () => {
    const { sut, repository } = makeSut()
    const addSpy = jest.spyOn(repository, 'add')
    await sut.add(makeFakeCurrency())
    expect(addSpy).toHaveBeenCalledWith(makeFakeCurrency())
  })
})
