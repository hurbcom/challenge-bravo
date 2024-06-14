import { CurrencyRate } from '@/domain/entity/';
import { InvalidParamError } from '@/domain/errors';

describe('Currency Rate', () => {
  it('should create a currency rate', () => {
    const currencyRate = CurrencyRate.create('US Dollar', 'USD', '$', 2, 1);
    expect(currencyRate).toBeDefined();
  });

  it('should convert an amount to another currency', () => {
    const usdCurrencyRate = CurrencyRate.create('US Dollar', 'USD', '$', 2, 1);
    const brlCurrencyRate = CurrencyRate.create(
      'Brazilian Real',
      'BRL',
      'R$',
      2,
      5.2
    );
    expect(usdCurrencyRate.convertTo(brlCurrencyRate, 1)).toBe(5.2);
    expect(usdCurrencyRate.convertTo(brlCurrencyRate, 2)).toBe(10.4);
    expect(brlCurrencyRate.convertTo(usdCurrencyRate, 5.2)).toBe(1);
    expect(brlCurrencyRate.convertTo(usdCurrencyRate, 10.4)).toBe(2);
  });

  it('should throw an error when the rate is invalid', () => {
    try {
      CurrencyRate.create('US Dollar', 'USD', '$', 2, 0);
      fail('Expected to throw an error');
    } catch (error: any) {
      expect(error).toBeInstanceOf(InvalidParamError);
      expect(error.message).toBe('Invalid rate');
    }
    try {
      CurrencyRate.create('US Dollar', 'USD', '$', 2, -1);
      fail('Expected to throw an error');
    } catch (error: any) {
      expect(error).toBeInstanceOf(InvalidParamError);
      expect(error.message).toBe('Invalid rate');
    }
  });

  it('should throw an error when the name is invalid', () => {
    try {
      CurrencyRate.create('', 'USD', '$', 2, 1);
      fail('Expected to throw an error');
    } catch (error: any) {
      expect(error).toBeInstanceOf(InvalidParamError);
      expect(error.message).toBe('Invalid name');
    }
  });

  it('should throw an error when the code is invalid', () => {
    try {
      CurrencyRate.create('US Dollar', '', '$', 2, 1);
      fail('Expected to throw an error');
    } catch (error: any) {
      expect(error).toBeInstanceOf(InvalidParamError);
      expect(error.message).toBe('Invalid code');
    }
  });

  it('should throw an error when the symbol is invalid', () => {
    try {
      CurrencyRate.create('US Dollar', 'USD', '', 2, 1);
      fail('Expected to throw an error');
    } catch (error: any) {
      expect(error).toBeInstanceOf(InvalidParamError);
      expect(error.message).toBe('Invalid symbol');
    }
  });

  it('should throw an error when the decimal digits is invalid', () => {
    try {
      CurrencyRate.create('US Dollar', 'USD', '$', -1, 1);
      fail('Expected to throw an error');
    } catch (error: any) {
      expect(error).toBeInstanceOf(InvalidParamError);
      expect(error.message).toBe('Invalid decimal digits');
    }
  });

  it('should throw an error when the rate is invalid', () => {
    try {
      CurrencyRate.create('US Dollar', 'USD', '$', 2, 0);
      fail('Expected to throw an error');
    } catch (error: any) {
      expect(error).toBeInstanceOf(InvalidParamError);
      expect(error.message).toBe('Invalid rate');
    }
    try {
      CurrencyRate.create('US Dollar', 'USD', '$', 2, -1);
      fail('Expected to throw an error');
    } catch (error: any) {
      expect(error).toBeInstanceOf(InvalidParamError);
      expect(error.message).toBe('Invalid rate');
    }
  });
});
