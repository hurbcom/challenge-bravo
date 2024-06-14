import { InvalidParamError } from '../errors';

export class Rate {
  private _value: number;

  constructor(value: number) {
    if (value <= 0) {
      throw new InvalidParamError('Invalid rate');
    }
    this._value = value;
  }

  get value() {
    return this._value;
  }
}

export default Rate;
