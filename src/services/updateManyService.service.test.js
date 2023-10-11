import { describe, expect, test } from 'vitest'
import { UpdateManyCurrencyService } from '../services/updateManyCurrency.service.js'
import { InMemoryCurrencyRepository } from '../../tests/repository/inMemoryCurrencyRepository.js'

describe('Update currency service', () => {
  test('should be able to upgrade many currencies', async () => {
    const currencyRepository = new InMemoryCurrencyRepository()
    const updateManyCurrency = new UpdateManyCurrencyService(currencyRepository)

    await updateManyCurrency.execute([
      { base: 'USD', code: 'EUR', price: 2 },
      { base: 'USD', code: 'BRL', price: 4 }
    ])
    expect(currencyRepository.currencies[0].price).toBe(2)
    expect(currencyRepository.currencies[1].price).toBe(4)
  })
})
