import { describe, expect, it } from 'vitest'
import { DeleteSupportedCurrencyService } from './deleteSupportedCurrency.service.js'
import { InMemoryCurrencyRepository } from '../../../tests/repository/inMemoryCurrencyRepository.js'
import { DeleteCurrencyService } from '../deleteCurrency.service.js'

const supportedCurrenciesRepository = {
  supportedCurrencies: ['BRL'],
  deleteSupportedCurrency: (code) => {
    const index = supportedCurrenciesRepository.supportedCurrencies.indexOf(code)
    if (index === -1) return false
    supportedCurrenciesRepository.supportedCurrencies.splice(index, 1)
    return true
  }

}

describe('Delete Supported Currency Service', () => {
  const currencyRepository = new InMemoryCurrencyRepository()
  const deleteCurrencyService = new DeleteCurrencyService(currencyRepository)
  const deleteSupportedCurrencyService = new DeleteSupportedCurrencyService(supportedCurrenciesRepository, deleteCurrencyService)

  it('should be able to delete a currency from the support ', async () => {
    const code = 'BRL'
    await expect(deleteSupportedCurrencyService.execute(code)).resolves.toBeTruthy()
  })
})
