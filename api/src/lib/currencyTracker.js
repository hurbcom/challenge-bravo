const { createFetcher } = require('../util/fetch')

function createCurrencyTracker() {
  const baseUrl = 'https://min-api.cryptocompare.com/data/price'
  const client = createFetcher()
  client.setDefaultHeaders({ authorization: `Apikey ${process.env.API_KEY}` })

  return {
    async getLastPrices(codes) {
      const url = `${baseUrl}/?fsym=USD&tsyms=${codes.join(',')}`
      const response = await client.fetch(url)
      const rates = await response.json()

      return rates
    },
  }
}

module.exports = { createCurrencyTracker }
