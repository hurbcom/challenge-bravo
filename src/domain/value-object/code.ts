import { InvalidParamError } from '../errors';

export class Code {
  private _value: string;

  constructor(value: string) {
    if (value.length < 3 || value.length > 4) {
      throw new InvalidParamError('Invalid code');
    }
    this._value = value.toUpperCase();
  }

  get value() {
    return this._value;
  }
}

export default Code;
