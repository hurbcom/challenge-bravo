import axios from 'axios'

export const requestCoin = async (coin: string): Promise<number> => {
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
    throw new Error('Coin not found')
  }
}
