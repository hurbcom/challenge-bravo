export class ConvertCurrencyService {
  #currencyRepository
  constructor (currencyRepository) {
    this.#currencyRepository = currencyRepository
  }

  async execute (request) {
    const { from, to, amount } = request

    /* let rates;
    let ratesRedis = await getRedis('rates');
    if(!ratesRedis){
      const currencies = await this.#currencyRepository.getCurrencies();
      rates = currencies.rates
    } else {
      rates = JSON.parse(ratesRedis)
    }
    await setRedis('rates', JSON.stringify(rates)); */

    const { rates } = await this.#currencyRepository.getCurrencies()

    let priceFrom = 1
    if (from !== 'USD') {
      priceFrom = rates[from]
      if (!priceFrom) {
        throw new Error(`Currency not found: ${from}`)
      }
    }
    const usd = (amount / priceFrom)
    if (to === 'USD') {
      return Number(usd.toFixed(4))
    }
    const priceTo = rates[to]
    if (!priceTo) {
      throw new Error(`Currency not found: ${to}`)
    }
    const response = usd * priceTo

    return Number(response.toFixed(4))
  }
}
