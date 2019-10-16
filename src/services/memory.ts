import cache from 'memory-cache'

class MemoryManage {
  private checkCurrency (): Array<string> {
    const currencies: string = cache.get('currencies')
    const currencyArr: Array<string> = currencies.split(',')
    return currencyArr
  }

  public GetCurrencies (): string {
    return cache.get('currencies')
  }

  public AddCurrency (currency: string): string {
    const currencies = this.checkCurrency()
    currencies.push(currency)
    return currencies.join()
  }
}

export default new MemoryManage()
