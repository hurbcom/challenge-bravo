import { Currency } from './currency.entity';

const currencyMock = {
  code: 'BRL',
  unitCost: '0.19',
  backingCurrency: 'USD',
  id: '123'
};

describe('Currency entity unit tests', () => {
  it('should return a currency', () => {
    const currency = new Currency(
      currencyMock.code,
      currencyMock.unitCost,
      currencyMock.backingCurrency,
      currencyMock.id
    );

    expect(currency.id).toBe(currencyMock.id);
    expect(currency.backingCurrency).toBe(currencyMock.backingCurrency);
    expect(currency.unitCost).toBe(currencyMock.unitCost);
    expect(currency.code).toBe(currencyMock.code);
  });

  it('should return a currency without id', () => {
    const currency = new Currency(
      currencyMock.code,
      currencyMock.unitCost,
      currencyMock.backingCurrency
    );

    expect(currency.id).toBe(undefined);
    expect(currency.backingCurrency).toBe(currencyMock.backingCurrency);
    expect(currency.unitCost).toBe(currencyMock.unitCost);
    expect(currency.code).toBe(currencyMock.code);
  });

  it('should return a currency with backingCurrency USD if not provided', () => {
    const currency = new Currency(
      currencyMock.code,
      currencyMock.unitCost
    );

    expect(currency.backingCurrency).toBe('USD');
    expect(currency.unitCost).toBe(currencyMock.unitCost);
    expect(currency.code).toBe(currencyMock.code);
  });

  it('should throw an error Invalid code', () => {
    expect(() => {
      new Currency(
        '',
        currencyMock.unitCost,
        currencyMock.backingCurrency,
        currencyMock.id
      );
    }).toThrow('Invalid code');
  });

  it('should throw an error Invalid unit cost', () => {
    expect(() => {
      new Currency(
        currencyMock.code,
        '',
        currencyMock.backingCurrency,
        currencyMock.id
      );
    }).toThrow('Invalid unit cost');
  });

  it('should throw an error Invalid backingCurrency', () => {
    expect(() => {
      new Currency(
        currencyMock.code,
        currencyMock.unitCost,
        '',
        currencyMock.id
      );
    }).toThrow('Invalid backingCurrency');
  });
});
