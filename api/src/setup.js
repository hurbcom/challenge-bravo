const config = require('./config')

const {
  createCurrencyRepository,
} = require('./repositories/currencyRepository')
const { createCurrencyTracker } = require('./lib/currencyTracker')

async function setup() {
  const currencyRepository = createCurrencyRepository()
  const currencyTracker = createCurrencyTracker()

  for (const code of config.initialCurrencies) {
    const currencyExists = await currencyRepository.get(code)
    if (currencyExists) {
      continue
    }
    const rate = await currencyTracker.getLastPrice(code)
    const currency = { code, rate }
    currencyRepository.add(currency)
  }
}

module.exports = setup
