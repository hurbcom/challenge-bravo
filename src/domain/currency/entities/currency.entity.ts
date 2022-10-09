import Big from 'big.js';

export class Currency {
  private _id!: string;
  private _currency!: string;
  private _backingCurrency?: string;
  private _unitCost!: string;

  constructor(id: string, currency: string, unitCost: string, backingCurrency = 'USD') {
    this._id = id;
    this._currency = currency;
    this._unitCost = unitCost;
    this._backingCurrency = backingCurrency;
  }

  get id(): string {
    return this._id;
  }
  
  get currency(): string {
    return this._currency;
  }

  get backingCurrency(): string | undefined {
    return this._backingCurrency;
  }

  get unitCost(): string {
    return this._unitCost;
  }

  convert(to: Currency, amount: string) {
    if(this._backingCurrency === to.currency) {
      return amount;
    }

    if(this._backingCurrency !== to.backingCurrency) {
      throw new Error(`This currency has no relation with provided "to" (${to.currency})`);
    }
    
    return new Big(this._unitCost)
      .times(amount)
      .div(to._unitCost)
      .round(2)
      .valueOf();
  }
}