import currency from "currency.js";
import InvalidParamsError from "./errors/invalid-params.error";

export default class Currency {
  private _value: currency;

  constructor(value: number) {
    if (typeof value !== 'number') {
      throw new InvalidParamsError('Invalid value');
    }
    this._value = currency(value);
  }

  get value(): number {
    return this._value.value;
  }

  multiply(value: number): void {
    this._value = this._value.multiply(value);
  }
}

// currency.js documentation: https://currency.js.org/