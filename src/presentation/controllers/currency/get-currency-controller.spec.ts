import { CurrencyModel } from '../../../domain/models/currency'
import { GetCurrency } from '../../../domain/usecases/get-currency'
import { ListCurrencies } from '../../../domain/usecases/list-currencies'
import { HttpRequest } from '../../protocols/http'
import { GetCurrencyController } from './get-currency-controller'

const makeGetCurrency = ():GetCurrency => {
  class GetCurrencyStub implements GetCurrency {
    getByShortName (shortName: string): Promise<CurrencyModel> {
      return new Promise(resolve => resolve({ name: 'Tether', shortName: 'USDT', USDvalue: 1 }))
    }
  }
  return new GetCurrencyStub()
}

const makeListCurrency = ():ListCurrencies => {
  class ListCurrenciesStub implements ListCurrencies {
    list (): Promise<CurrencyModel[]> {
      return new Promise(resolve => resolve([{ name: 'Tether', shortName: 'USDT', USDvalue: 1 }]))
    }
  }
  return new ListCurrenciesStub()
}

const makeSut = () => {
  const getCurrency = makeGetCurrency()
  const lisCurrency = makeListCurrency()
  const sut = new GetCurrencyController(getCurrency, lisCurrency)
  return { getCurrency, lisCurrency, sut }
}

const makeFakeRequest = ():HttpRequest => ({
  params: {
    shortName: 'USDt'
  }
})
describe('get currency controller', () => {
  test('should call getCurrency with the right values', async () => {
    const { getCurrency, sut } = makeSut()
    const getByShortNameSpy = jest.spyOn(getCurrency, 'getByShortName')
    await sut.handle(makeFakeRequest())
    expect(getByShortNameSpy).toHaveBeenCalledWith('USDT')
  })
  test('should return 200 with data', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(200)
    expect(response.body.shortName).toBeDefined()
  })
  test('should call listCurrencies if no param was provided', async () => {
    const { lisCurrency, sut } = makeSut()
    const listSpy = jest.spyOn(lisCurrency, 'list')
    await sut.handle({})
    expect(listSpy).toHaveBeenCalled()
  })
  test('should return a list on list called', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response.statusCode).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
  })
  test('should return 500 on get error', async () => {
    const { getCurrency, sut } = makeSut()
    jest.spyOn(getCurrency, 'getByShortName').mockRejectedValueOnce(new Error(''))
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(500)
  })
  test('should return 500 on list error', async () => {
    const { lisCurrency, sut } = makeSut()
    jest.spyOn(lisCurrency, 'list').mockRejectedValueOnce(new Error(''))
    const response = await sut.handle({})
    expect(response.statusCode).toBe(500)
  })
})
