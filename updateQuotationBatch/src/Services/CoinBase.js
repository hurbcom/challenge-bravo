import { requestCoin } from './CoinService.js'

const currenciesDefault = Object.freeze(['BRL', 'EUR', 'BTC', 'ETH'])

export async function getCoinsFromService() {
  console.log('Fetching coins:::')
  const coinsInDollar = await Promise.all(
    currenciesDefault.map((coin) => requestCoin(coin))
  )

  const coins = coinsInDollar.reduce((previous, coin) => {
    const struct = {
      name: coin.name,
      value: coin.value,
      requiredBySystem: true
    }

    previous[coin.name] = JSON.stringify(struct)

    return previous
  }, {})

  return Object.entries(coins)
}
