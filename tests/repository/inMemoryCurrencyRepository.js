export class InMemoryCurrencyRepository {
  currencies = {
    base: 'USD',
    rates: {
      EUR: 0.918442,
      BRL: 4.916146,
      BTC: 0.000039,
      ETH: 0.000571
    }
  }

  getCurrencies (code = null) {
    if (code) {
      const result = this.currencies.rates[code]
      if (!result) {
        return false
      }
      const response = {}
      response[code] = result
      return response
    }
    return this.currencies
  }
}
