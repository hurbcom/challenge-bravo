import { expect, test, describe } from 'vitest'
import { InMemoryCurrencyRepository } from '../../tests/repository/inMemoryCurrencyRepository.js'
import { RegisterCurrencyService } from './registerCurrency.service'

describe('Register currency service', () => {
  const currencyRepository = new InMemoryCurrencyRepository()
  const registerCurrency = new RegisterCurrencyService(currencyRepository)
  test('should be able register an new currency', async () => {
    const response = await registerCurrency.execute({
      code: 'MAT',
      price: 0.987
    })

    expect(response).toBeTruthy()
    expect(currencyRepository.currencies[4].code).toEqual('MAT')
  })

  test('should not be able register currency already registered', async () => {
    await expect(
      registerCurrency.execute({
        code: 'BRL',
        price: 4.8
      })
    ).rejects.toThrow()
  })
})
