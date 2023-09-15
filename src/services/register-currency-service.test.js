import { expect, test, describe } from 'vitest'
import { InMemoryCurrencyRepository } from '../../tests/repository/inMemoryCurrencyRepository.js'
import { RegisterCurrencyService } from './registerCurrency.service'

describe('Insert currency service', () => {
  const currencyRepository = new InMemoryCurrencyRepository()
  const registerCurrency = new RegisterCurrencyService(currencyRepository)
  test('should be able register an new currency', async () => {
    const response = await registerCurrency.execute({
      code: 'MAT',
      price: 0.987
    })

    expect(response).toBeTruthy()
    expect(response).toEqual({
      base: 'USD',
      rates: {
        EUR: 0.918442,
        BRL: 4.916146,
        BTC: 0.000039,
        ETH: 0.000571,
        MAT: 0.987
      }
    })
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
