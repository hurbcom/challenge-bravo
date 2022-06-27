const { createFetcher } = require('../util/fetch')

function createCurrencyTracker() {
  const baseUrl = 'https://min-api.cryptocompare.com/data/price'
  const client = createFetcher()
  client.setDefaultHeaders({ authorization: `Apikey ${process.env.API_KEY}` })

  return {
    async getLastPrices(codes) {
      const url = `${baseUrl}?fsym=USD&tsyms=${codes.join(',')}`
      const response = await client.fetch(url)
      const data = await response.json()
      if (data.Response === 'Error' && data.Type === 1) {
        // None of the currency codes passed to the API is a supported currency
        return {}
      }

      return data
    },

    async getLastPrice(code) {
      const rate = await this.getLastPrices([code])
      return rate[code]
    },
  }
}

module.exports = { createCurrencyTracker }
