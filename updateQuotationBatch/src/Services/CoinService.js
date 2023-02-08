import axios from 'axios'

export async function requestCoin(coin) {
  try {
    const response = await axios.get(
      `https://rest.coinapi.io/v1/exchangerate/${coin}/USD`,
      {
        headers: {
          'X-CoinAPI-Key': process.env.COIN_API_KEY
        }
      }
    )

    return response.data.rate
  } catch (e) {
    console.log('e:::', e)
    throw new Error('Coin not found')
  }
}
