import { CurrencyModel } from '../../domain/models/currency'
import { ListCurrencies } from '../../domain/usecases/list-currencies'
import { UpsertCurrency } from '../../domain/usecases/upsert-currency'
import { UpdateCurrenciesUsingExternalService } from './update-currencies-using-external-service'
const makeListCurrencies = ():ListCurrencies => {
  class ListCurrenciesStub implements ListCurrencies {
    list (): Promise<CurrencyModel[]> {
      return new Promise(resolve => resolve([{ shortName: 'USD', USDvalue: 1 }, { shortName: 'BRL', USDvalue: 5.62 }]))
    }
  }
  return new ListCurrenciesStub()
}
const makeUpsertCurrency = ():UpsertCurrency => {
  class UpserCurrencyStub implements UpsertCurrency {
    upsert (currency: CurrencyModel): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new UpserCurrencyStub()
}
const makeSut = () => {
  const listCurrencies = makeListCurrencies()
  const upsertCurrency = makeUpsertCurrency()
  const sut = new UpdateCurrenciesUsingExternalService('', listCurrencies, upsertCurrency)
  return { sut, upsertCurrency, listCurrencies }
}
describe('update currencies using external service job', () => {
  test('should call listCurrencies', async () => {
    const { sut, listCurrencies } = makeSut()
    const listSpy = jest.spyOn(listCurrencies, 'list')
    await sut.handle()
    expect(listSpy).toHaveBeenCalled()
  })
  test('should call upsertCurrenci twice', async () => {
    const { sut, upsertCurrency } = makeSut()
    const upsertSpy = jest.spyOn(upsertCurrency, 'upsert')
    await sut.handle()
    expect(upsertSpy).toHaveBeenCalledTimes(2)
  })
  test('should not thow on listCurrencies error', async () => {
    const { sut, listCurrencies } = makeSut()
    jest.spyOn(listCurrencies, 'list').mockRejectedValueOnce(new Error(''))
    const promise = sut.handle()
    await expect(promise).resolves
  })
  test('should not thow on upsertCurrency error', async () => {
    const { sut, upsertCurrency } = makeSut()
    jest.spyOn(upsertCurrency, 'upsert').mockRejectedValueOnce(new Error(''))
    const promise = sut.handle()
    await expect(promise).resolves
  })
  test('should return the job name', async () => {
    const { sut } = makeSut()
    const name = sut.getName()
    expect(name).toEqual('Update Currencies Using External Service')
  })
})
