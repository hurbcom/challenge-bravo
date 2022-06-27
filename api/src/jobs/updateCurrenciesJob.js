const {
  createCurrencyRepository,
} = require('../repositories/currencyRepository')
const { createCurrencyTracker } = require('../lib/currencyTracker')

const updateCurrenciesJob = {
  async execute() {
    const currencyRepository = createCurrencyRepository()
    const currencyTracker = createCurrencyTracker()

    const currencies = await currencyRepository.getAll()
    const realCurrencies = currencies.filter((c) => c.type === 'real')
    if (realCurrencies.length === 0) {
      return
    }
    const codes = realCurrencies.map((c) => c.code)
    const rates = await currencyTracker.getLastPrices(codes)

    const updateCurrencies = (currencies, rates) => {
      const updates = []
      for (const currency of currencies) {
        currency.rate = rates[currency.code] || currency.rate
        let promise = currencyRepository.update(currency)
        updates.push(promise)
      }

      return Promise.all(updates)
    }

    const updated = await updateCurrencies(realCurrencies, rates)
    console.log(`${updated.length} currencies updated!`)
  },
}

module.exports = { updateCurrenciesJob }
