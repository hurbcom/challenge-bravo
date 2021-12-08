import { CurrencyModel } from '../../domain/models/currency'
import { AddCurrency } from '../../domain/usecases/add-currency'
import { ListCurrencies } from '../../domain/usecases/list-currencies'
import { CurrencySeeder } from './currency-seeder'
const makeListCurrencies = (returnEmpty?:boolean):ListCurrencies => {
  class ListCurrenciesStub implements ListCurrencies {
    list (): Promise<CurrencyModel[]> {
      return new Promise(resolve => resolve(returnEmpty ? [] : [{ shortName: 'USD', USDvalue: 1 }, { shortName: 'BRL', USDvalue: 5.62 }]))
    }
  }
  return new ListCurrenciesStub()
}
const makeAddCurrency = ():AddCurrency => {
  class AddCurrencyStub implements AddCurrency {
    add (currency: CurrencyModel): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new AddCurrencyStub()
}

const makeSut = () => {
  const localCurrencies = makeListCurrencies(true)
  const externalCurrencies = makeListCurrencies()

  const addCurrency = makeAddCurrency()
  const sut = new CurrencySeeder('', localCurrencies, externalCurrencies, addCurrency)
  return { sut, localCurrencies, externalCurrencies, addCurrency }
}
describe('update currencies using external service job', () => {
  test('should call localCurrencies', async () => {
    const { sut, localCurrencies } = makeSut()
    const listSpy = jest.spyOn(localCurrencies, 'list')
    await sut.handle()
    expect(listSpy).toHaveBeenCalled()
  })
  test('should call externalCurrencies if localCurrencies return empty', async () => {
    const { sut, externalCurrencies } = makeSut()
    const listSpy = jest.spyOn(externalCurrencies, 'list')
    await sut.handle()
    expect(listSpy).toHaveBeenCalled()
  })
  test('should call addCurrency if localCurrencies return empty and externalCurrencies return something', async () => {
    const { sut, addCurrency } = makeSut()
    const addSpy = jest.spyOn(addCurrency, 'add')
    await sut.handle()
    expect(addSpy).toHaveBeenCalledTimes(3)
  })
  test('should not call addCurrency if localCurrencies return empty and externalCurrencies return empty', async () => {
    const { sut, addCurrency, externalCurrencies } = makeSut()
    jest.spyOn(externalCurrencies, 'list').mockResolvedValueOnce([])
    const addSpy = jest.spyOn(addCurrency, 'add')
    await sut.handle()
    expect(addSpy).toHaveBeenCalledTimes(1)
  })
  test('should not call externalCurrencies if localCurrencies return something', async () => {
    const { sut, externalCurrencies, localCurrencies } = makeSut()
    jest.spyOn(localCurrencies, 'list').mockResolvedValueOnce([{ shortName: 'USD', USDvalue: 1 }, { shortName: 'BRL', USDvalue: 5.62 }])
    const listSpy = jest.spyOn(externalCurrencies, 'list')
    await sut.handle()
    expect(listSpy).not.toHaveBeenCalled()
  })
  test('should not throw if localCurrencies throws', async () => {
    const { sut, localCurrencies } = makeSut()
    jest.spyOn(localCurrencies, 'list').mockRejectedValueOnce(new Error(''))
    const promise = sut.handle()
    await expect(promise).resolves
  })
  test('should not throw if externalCurrencies throws', async () => {
    const { sut, externalCurrencies } = makeSut()
    jest.spyOn(externalCurrencies, 'list').mockRejectedValueOnce(new Error(''))
    const promise = sut.handle()
    await expect(promise).resolves
  })
  test('should not throw if addCurrency throws', async () => {
    const { sut, addCurrency } = makeSut()
    jest.spyOn(addCurrency, 'add').mockRejectedValueOnce(new Error(''))
    const promise = sut.handle()
    await expect(promise).resolves
  })
  test('should not throw if addCurrency throws on loop', async () => {
    const { sut, addCurrency } = makeSut()
    jest.spyOn(addCurrency, 'add').mockResolvedValueOnce(true)
    jest.spyOn(addCurrency, 'add').mockRejectedValueOnce(new Error(''))
    const promise = sut.handle()
    await expect(promise).resolves
  })

  test('should return the job name', async () => {
    const { sut } = makeSut()
    const name = sut.getName()
    expect(name).toEqual('Currency Seeder')
  })
})
