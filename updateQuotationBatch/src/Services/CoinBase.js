import { requestCoin } from './CoinService.js'

const currenciesDefault = Object.freeze(['BRL', 'EUR', 'BTC', 'ETH'])

export async function getCoinsFromService() {
  console.log('Fetching coins:::')
  const coinsInDollar = await Promise.all(
    currenciesDefault.map((coin) => requestCoin(coin))
  )

  let coins = []

  for (let index = 0; index < currenciesDefault.length; index++) {
    const coin = currenciesDefault[index]

    const struct = {
      name: coin,
      value: coinsInDollar[index],
      requiredBySystem: true
    }

    coins.push(coin)
    coins.push(JSON.stringify(struct))
  }

  return coins
}
