import CurrencyRate from "@/domain/currency-rate";

describe('Currency Rate', () => {

  it('should create a currency rate', () => {
    const currencyRate = CurrencyRate.create('US Dollar', 'USD', '$', 2, 1);
    expect(currencyRate).toBeDefined();
  });

  it('should convert an amount to another currency', () => {
    const usdCurrencyRate = CurrencyRate.create('US Dollar', 'USD', '$', 2, 1);
    const brlCurrencyRate = CurrencyRate.create('Brazilian Real', 'BRL', 'R$', 2, 5.2);
    expect(usdCurrencyRate.convertTo(brlCurrencyRate, 1)).toBe(5.20);
    expect(usdCurrencyRate.convertTo(brlCurrencyRate, 2)).toBe(10.40);
    expect(brlCurrencyRate.convertTo(usdCurrencyRate, 5.2)).toBe(1);
    expect(brlCurrencyRate.convertTo(usdCurrencyRate, 10.40)).toBe(2);
  });

  it('should throw an error when the rate is invalid', () => {
    expect(() => CurrencyRate.create('US Dollar', 'USD', '$', 2, 0)).toThrow('Invalid rate');
    expect(() => CurrencyRate.create('US Dollar', 'USD', '$', 2, -1)).toThrow('Invalid rate');
  });

  it('should throw an error when the name is invalid', () => {
    expect(() => CurrencyRate.create('', 'USD', '$', 2, 1)).toThrow('Invalid name');
  });

  it('should throw an error when the code is invalid', () => {
    expect(() => CurrencyRate.create('US Dollar', '', '$', 2, 1)).toThrow('Invalid code');
  });

  it('should throw an error when the symbol is invalid', () => {
    expect(() => CurrencyRate.create('US Dollar', 'USD', '', 2, 1)).toThrow('Invalid symbol');
  });

  it('should throw an error when the decimal points is invalid', () => {
    expect(() => CurrencyRate.create('US Dollar', 'USD', '$', -1, 1)).toThrow('Invalid decimal point');
    expect(() => CurrencyRate.create('US Dollar', 'USD', '$', 11, 1)).toThrow('Invalid decimal point');
  });

  it('should throw an error when the rate is invalid', () => {
    expect(() => CurrencyRate.create('US Dollar', 'USD', '$', 2, 0)).toThrow('Invalid rate');
    expect(() => CurrencyRate.create('US Dollar', 'USD', '$', 2, -1)).toThrow('Invalid rate');
  });

});