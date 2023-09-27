import { describe, expect, test } from 'vitest'
import { InMemoryCurrencyRepository } from '../../../tests/repository/inMemoryCurrencyRepository.js'
import { RegisterCurrencyService } from '../registerCurrency.service.js'
import { ExtendSupportedCurrencyService } from './extendSupportedCurrency.service.js'

const resourceExtern = {
  getCurrencyByCode: (code) => {
    if (code === 'MOCK') {
      return {
        code: 'MOCK',
        price: 2.6849
      }
    }

    return false
  }
}

const supportedCurrencyRepository = {
  supportedCurrency: [],
  registerSupportedCurrency: (code) => {
    supportedCurrencyRepository.supportedCurrency.push(code)
    return supportedCurrencyRepository.supportedCurrency
  }
}

describe('Register Supported Currency Service', () => {
  const currencyRepository = new InMemoryCurrencyRepository()
  const registerCurrencyService = new RegisterCurrencyService(currencyRepository)
  test('should be able register an currency truthy in supported currencies', async () => {
    const extendSupportedCurrency = new ExtendSupportedCurrencyService(supportedCurrencyRepository, registerCurrencyService, resourceExtern)

    const code = 'MOCK'
    const response = await extendSupportedCurrency.execute(code)

    expect(response).toBeTruthy()
  })
  test('should be able register an currency falsy in supported currencies', async () => {
    const extendSupportedCurrency = new ExtendSupportedCurrencyService(supportedCurrencyRepository, registerCurrencyService, resourceExtern)

    const code = 'FAKE'

    await expect(extendSupportedCurrency.execute(code)).rejects.toThrowError()
  })
})
