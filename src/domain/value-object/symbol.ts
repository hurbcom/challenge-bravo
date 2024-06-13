export class Symbol {
  private _value: string;

  constructor(value: string) {
    if (value.length < 1 || value.length > 5) {
      throw new Error('Invalid symbol');
    }
    this._value = value;
  }

  get value() {
    return this._value;
  }
}

export default Symbol;
