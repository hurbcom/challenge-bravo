
export default class CurrencyRate {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly code: string,
    readonly symbol: string,
    readonly decimalPoints: number,
    readonly rate: number,
  ) { }

  static create(name: string, code: string, symbol: string, decimalPoints: number, rate: number): CurrencyRate {
    if (rate <= 0) {
      throw new Error('Invalid rate');
    }
    const id = crypto.randomUUID();
    return new CurrencyRate(id, name, code, symbol, decimalPoints, rate);
  }
}