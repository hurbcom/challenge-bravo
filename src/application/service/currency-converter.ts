import Currency from '@/domain/currency';
import InvalidParamsError from '@/domain/errors/invalid-params.error';

export default class CurrencyConverter {
  private _rateFrom: number;
  private _rateTo: number;

  constructor(rateFrom: number, rateTo: number) {
    if (rateFrom <= 0 || rateTo <= 0) {
      throw new InvalidParamsError('Invalid rate');
    }
    this._rateFrom = rateFrom;
    this._rateTo = rateTo;
  }

  convert(amount: number): number {
    if (amount < 0) {
      throw new InvalidParamsError('Invalid amount');
    }
    const amountCurrency = new Currency(amount)
    amountCurrency.multiply(this._rateTo / this._rateFrom);
    return amountCurrency.value;
  }
}