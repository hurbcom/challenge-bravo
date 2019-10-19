import Currencies from '../models/Currencies'
class Format {
  private valuesToFloat (value: string): number {
    if (value.includes(',') && value.includes('.')) value = value.replace('.', '')
    value = value.replace(',', '.')
    return parseFloat(value)
  }

  public KeysToString (object: object): string {
    let list: Array<string> = []
    Object.keys(object).forEach(key => {
      list = [...list, key]
    })
    return list.join()
  }

  public ExchangeRate (from: keyof Currencies, to: keyof Currencies, currencies: Currencies): number {
    const fromRate: string = currencies[from].ask
    const toRate: string = currencies[to].ask
    return this.valuesToFloat(fromRate) / this.valuesToFloat(toRate)
  }
}

export default new Format()
