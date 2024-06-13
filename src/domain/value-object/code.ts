export class Code {
  private _value: string;

  constructor(value: string) {
    if (value.length < 3 || value.length > 4) {
      throw new Error('Invalid code');
    }
    this._value = value.toUpperCase();
  }

  get value() {
    return this._value;
  }
}

export default Code;
