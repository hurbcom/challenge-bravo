import CurrencyRate from "@/domain/currency-rate";

describe('Currency Rate', () => {

  it('should create a currency rate', () => {
    const currencyRate = CurrencyRate.create('US Dollar', 'USD', '$', 2, 1);
    expect(currencyRate).toBeDefined();
  });

  it('should throw an error when the rate is invalid', () => {
    expect(() => CurrencyRate.create('US Dollar', 'USD', '$', 2, 0)).toThrow('Invalid rate');
  });

});