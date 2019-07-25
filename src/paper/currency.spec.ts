import { Currency } from './currency';

const currency = new Currency("USD", 1, 1.0);

describe('Currency', () => {
  it('should be defined', () => {
    expect(currency).toBeDefined();
  });
});
