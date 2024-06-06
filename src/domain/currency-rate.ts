import currency from "currency.js";

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

  convertTo(currencyRate: CurrencyRate, amount: number): number {
    if (amount < 0) {
      throw new Error('Invalid amount');
    }
    const convertedAmount = amount * currencyRate.rate / this.rate;
    const amountCurrency = currency(convertedAmount, { precision: currencyRate.decimalPoints });
    return amountCurrency.value;
  }

}