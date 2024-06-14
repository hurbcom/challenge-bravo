import { InvalidParamError } from '../errors';

export class DecimalDigits {
  private _value: number;

  constructor(value: number) {
    if (value < 0 || value > 10) {
      throw new InvalidParamError('Invalid decimal digits');
    }
    this._value = value;
  }

  get value() {
    return this._value;
  }
}

export default DecimalDigits;
