import CurrencyConverter from "@/application/service/currency-converter";

describe("Currency Converter", () => {

  it('should convert from smaller to bigger currency', () => {
    const currencyConverter = new CurrencyConverter(1, 2);
    expect(currencyConverter.convert(1)).toBe(2);
  });

  it('should convert from bigger to smaller currency', () => {
    const currencyConverter = new CurrencyConverter(1, 0.5);
    expect(currencyConverter.convert(2)).toBe(1);
  });

  it('should convert from equal currency', () => {
    const currencyConverter = new CurrencyConverter(1, 1);
    expect(currencyConverter.convert(1)).toBe(1);
  });

  it('should throw an error when the rate is zero or negative', () => {
    expect(() => new CurrencyConverter(0, 1)).toThrow("Invalid rate");
    expect(() => new CurrencyConverter(-1, 1)).toThrow("Invalid rate");
  });

  it('should throw an error when the amount is a negative number', () => {
    const currencyConverter = new CurrencyConverter(1, 5.20);
    expect(() => currencyConverter.convert(-1)).toThrow("Invalid amount");
  });

});