import Big from 'big.js';
import { randomUUID } from 'crypto';

export class Currency {
  private _id: string;
  private _code: string;
  private _backingCurrency: string;
  private _unitCost: string;

  constructor(code: string, unitCost: string, backingCurrency = 'USD') {
    this._id = randomUUID();
    this._code = code;
    this._unitCost = unitCost;
    this._backingCurrency = backingCurrency;
    this.validate();
  }

  validate() {
    if(this._unitCost.length === 0 || !Number(this._unitCost)) {
      throw new Error('Invalid unit cost');
    }
    if(this._code.length === 0) {
      throw new Error('Invalid code');
    }
    if(this._backingCurrency.length === 0) {
      throw new Error('Invalid backingCurrency');
    }
  }

  get id(): string {
    return this._id;
  }
  
  get code(): string {
    return this._code;
  }

  get backingCurrency(): string | undefined {
    return this._backingCurrency;
  }

  get unitCost(): string {
    return this._unitCost;
  }

  convert(to: Currency, amount: string) {
    if(this._backingCurrency === to.code) {
      return amount;
    }

    if(this._backingCurrency !== to.backingCurrency) {
      throw new Error(`This code has no relation with provided "to" (${to.code})`);
    }
    
    return new Big(this._unitCost)
      .times(amount)
      .div(to._unitCost)
      .round(2)
      .valueOf();
  }
}