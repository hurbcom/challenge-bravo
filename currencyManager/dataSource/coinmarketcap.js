const axios = require('axios')

async function getTicker() {
  try {
    const response = await axios.get('https://api.coinmarketcap.com/v2/ticker/')
    return Object.entries(response.data.data).map(i => {
      let value = i[1]

      return {
        currency: value.symbol,
        /* How much 1 dollar worths in symbol currency */
        value: 1 / value.quotes.USD.price
      }
    })
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
