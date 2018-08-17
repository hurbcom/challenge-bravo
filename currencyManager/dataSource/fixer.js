const axios = require('axios')

/* We have no access to USD coinBase */
const coinBase = "EUR"
const gsCoin = "USD"
const accessKey = process.env.FIXER_APIKEY
const latestEndpoint = "http://data.fixer.io/api/latest"
async function getTicker() {
  try {
    const response = await axios.get(latestEndpoint + "?access_key=" + accessKey + "&base=" + coinBase)

    if (!response.data.success) {
      throw "No success on request: " + response.data.error
    }

    /*
      We need to convert all values to gsCoin based values
      We do this because we have no access to use USD as base
      */
    var usdRate = response.data.rates[gsCoin]
    var fixRate = 1 / usdRate

    var currencies = Object.entries(response.data.rates).map(i => {
      let symbol = i[0]
      let value = i[1]

      value = value * fixRate

      /* ensure gold standard coin is equal 1 */
      if (symbol == gsCoin) {
        value = 1
      }

      return {
        currency: symbol,
        value
      }
    })
    return currencies
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  getCurrencies: function() {
    return getTicker()
  }
}
