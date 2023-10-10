// eslint-disable-next-line no-unused-vars
import { CurrencyRepository } from '../../src/repositories/currencyRepository.js'
import { makeCurrenciesApi } from '../make-currencies-api/make-currencies-api.js'

/**
 * @implements {CurrencyRepository}
 */
export class InMemoryCurrencyRepository {
  currencies = [...makeCurrenciesApi]

  getCurrencies (code) {
    if (code) {
      const result = this.currencies.find(currency => currency.code === code)
      if (!result) {
        return false
      }
      return result
    }
    return this.currencies
  }

  registerCurrency (currency) {
    this.currencies.push(currency)
  }

  async updateCurrency ({ base, code, price }) {
    const currency = this.currencies.find(currency => currency.code === code)

    if (!currency) {
      throw new Error('currency not found')
    }

    const index = this.currencies.indexOf(currency)
    this.currencies[index] = {
      base: base ?? 'USD',
      code,
      price
    }
  }

  deleteCurrency (code) {
    const currency = this.currencies.find(currency => currency.code === code)
    if (!currency) return false
    const index = this.currencies.indexOf(currency)
    this.currencies.splice(index, 1)
    return true
  }
}
