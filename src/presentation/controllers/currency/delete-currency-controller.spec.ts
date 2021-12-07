import { RemoveCurrency } from '../../../domain/usecases/delete-currency'
import { DeleteCurrencyController } from './delete-currency-controller'
const makeDeleteCurrency = ():RemoveCurrency => {
  class DeleteCurrencyStub implements RemoveCurrency {
    delete (shortName: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new DeleteCurrencyStub()
}
const makeSut = () => {
  const deleteCurrency = makeDeleteCurrency()
  const sut = new DeleteCurrencyController(deleteCurrency)
  return { sut, deleteCurrency }
}
describe('delete currency controller', () => {
  test('should return 400 on try to delete usd', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({ params: { shortName: 'USD' } })
    expect(response.statusCode).toBe(400)
  })
  test('should return 200 on delete currency', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({ params: { shortName: 'USDT' } })
    expect(response.statusCode).toBe(200)
  })
  test('should return 500 on any error', async () => {
    const { sut, deleteCurrency } = makeSut()
    jest.spyOn(deleteCurrency, 'delete').mockRejectedValueOnce(new Error())
    const response = await sut.handle({ params: { shortName: 'USDT' } })
    expect(response.statusCode).toBe(500)
  })
})
