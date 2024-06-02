import CurrencyConverter from "@/domain/currency-converter";

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

  it('should throw an error when the amount is a negative number', () => {
    const currencyConverter = new CurrencyConverter(1, 5.20);
    expect(() => currencyConverter.convert(-1)).toThrow("Invalid amount");
  });

});