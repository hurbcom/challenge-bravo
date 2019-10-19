import cache from 'memory-cache'

class MemoryManage {
  constructor () {
    this.starterData()
  }

  private starterData (): void {
    cache.put('currencies', 'USD,BRL,EUR,BTC,ETH')
  }

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
    cache.put('currencies', currencies.join())
    return currencies.join()
  }

  public RemoveCurrency (currency: string): string {
    let currencies = this.checkCurrency()
    currencies = currencies.filter((element) => element !== currency)
    cache.put('currencies', currencies.join())
    return currencies.join()
  }
}

export default new MemoryManage()
