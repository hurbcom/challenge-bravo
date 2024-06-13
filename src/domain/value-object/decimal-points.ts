export class DecimalPoints {
  private _value: number;

  constructor(value: number) {
    if (value < 0 || value > 10) {
      throw new Error('Invalid decimal point');
    }
    this._value = value;
  }

  get value() {
    return this._value;
  }
}

export default DecimalPoints;
