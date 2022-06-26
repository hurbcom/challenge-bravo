const fetch = require('node-fetch')
const {
  createCurrencyRepository,
} = require('../repositories/currencyRepository')

class HTTPResponseError extends Error {
  constructor(response, ...args) {
    super(
      `HTTP Error Response: ${response.status} ${response.statusText}`,
      ...args
    )
  }
}

async function fetchPrices(codes) {
  const baseUrl = 'https://min-api.cryptocompare.com/data/price'
  const params = `?fsym=USD&tsyms=${codes.join(',')}`
  const url = baseUrl + params
  const response = await fetch(url, {
    headers: { authorization: `Apikey ${process.env.API_KEY}` },
  })
  if (!response.ok) {
    throw new HTTPResponseError(response)
  }
  const rates = await response.json()

  return rates
}

const updateCurrenciesJob = {
  async execute() {
    const currencyRepository = createCurrencyRepository()

    const currencies = await currencyRepository.getAll()
    const realCurrencies = currencies.filter((c) => c.type === 'real')
    const codes = realCurrencies.map((c) => c.code)

    let rates
    try {
      rates = await fetchPrices(codes)
    } catch (err) {
      if (err instanceof HTTPResponseError) {
        console.error(err)
      } else {
        throw err
      }
    }

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
