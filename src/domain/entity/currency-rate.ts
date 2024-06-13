import currency from 'currency.js';

import {
  Code,
  DecimalPoints,
  Symbol as MySymbol,
  Name,
  Rate,
} from '@/domain/value-object';

export class CurrencyRate {
  private _name: Name;
  private _code: Code;
  private _symbol: MySymbol;
  private _decimalPoints: DecimalPoints;
  private _rate: Rate;

  constructor(
    readonly id: string,
    name: string,
    code: string,
    symbol: string,
    decimalPoints: number,
    rate: number
  ) {
    this._name = new Name(name);
    this._code = new Code(code);
    this._symbol = new MySymbol(symbol);
    this._decimalPoints = new DecimalPoints(decimalPoints);
    this._rate = new Rate(rate);
  }

  static create(
    name: string,
    code: string,
    symbol: string,
    decimalPoints: number,
    rate: number
  ): CurrencyRate {
    const id = crypto.randomUUID();
    return new CurrencyRate(id, name, code, symbol, decimalPoints, rate);
  }

  get name(): string {
    return this._name.value;
  }

  get code(): string {
    return this._code.value;
  }

  get symbol(): string {
    return this._symbol.value;
  }

  get decimalPoints(): number {
    return this._decimalPoints.value;
  }

  get rate(): number {
    return this._rate.value;
  }

  convertTo(currencyRate: CurrencyRate, amount: number): number {
    if (amount < 0) {
      throw new Error('Invalid amount');
    }
    const convertedAmount = (amount * currencyRate.rate) / this.rate;
    const amountCurrency = currency(convertedAmount, {
      precision: currencyRate.decimalPoints,
    });
    return amountCurrency.value;
  }
}

export default CurrencyRate;
