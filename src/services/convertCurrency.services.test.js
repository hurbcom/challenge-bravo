import { describe, expect, it } from 'vitest'
import { ConvertCurrencyService } from './convertCurrency.service'
import { InMemoryCurrencyRepository } from '../../tests/repository/inMemoryCurrencyRepository.js'

describe('convert currency service', () => {
  const currencyRepository = new InMemoryCurrencyRepository()
  const convertCurrencyService = new ConvertCurrencyService(currencyRepository)

  it('should be able of convert a currency to other', async () => {
    const response = await convertCurrencyService.execute({ from: 'BRL', to: 'EUR', amount: 70 })

    expect(response).toBeTruthy()
    expect(response).toBeTypeOf('number')
  })

  it('should return an error when sending currency not registered in the "from" field', async () => {
    await expect(convertCurrencyService.execute({ from: 'FAKE', to: 'EUR', amount: 70 })).rejects.toThrow()
  })
  it('should return an error when sending currency not registered in the "to" field', async () => {
    await expect(convertCurrencyService.execute({ from: 'BTC', to: 'FAKE', amount: 70 })).rejects.toThrow()
  })
})
