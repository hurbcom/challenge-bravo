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

  registerCurrency (currency) {
    const { code, price } = currency
    this.currencies.rates[code] = price

    return this.currencies
  }

  deleteCurrency (code) {
    delete this.currencies.rates[code]
  }
}
