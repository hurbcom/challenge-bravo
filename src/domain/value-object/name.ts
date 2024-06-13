export class Name {
  private _value: string;

  constructor(value: string) {
    if (value.length < 3 || value.length > 100) {
      throw new Error('Invalid name');
    }
    this._value = value;
  }

  get value() {
    return this._value;
  }
}

export default Name;
