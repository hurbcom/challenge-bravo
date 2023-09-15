import { describe, test, expect } from 'vitest'
import { InMemoryCurrencyRepository } from '../../tests/repository/inMemoryCurrencyRepository.js'
import { DeleteCurrencyService } from './deleteCurrency.service.js'

describe('Delete Currency service', () => {
  const currencyRepository = new InMemoryCurrencyRepository()
  const deleteCurrencyService = new DeleteCurrencyService(currencyRepository)
  test('should be able delete a currency', async () => {
    await expect(deleteCurrencyService.execute('BRL')).resolves.toBeTruthy()
  })
  test('should return an error when deleting a non-existent currency', async () => {
    await expect(deleteCurrencyService.execute('FAKE')).rejects.toThrow()
  })
})
