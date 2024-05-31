import Currency from '@/domain/currency';

export default class CurrencyConverter {
  private _rateFrom: number;
  private _rateTo: number;

  constructor(rateFrom: number, rateTo: number) {
    this._rateFrom = rateFrom;
    this._rateTo = rateTo;
  }

  convert(amount: number): number {
    const amountCurrency = new Currency(amount)
    amountCurrency.multiply(this._rateTo / this._rateFrom);
    return amountCurrency.value;
  }
}