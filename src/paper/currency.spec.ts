import { Currency } from './currency';

describe('Currency', () => {
  it('should be defined', () => {
    expect(new Currency("USD", 1, 1.0)).toBeDefined();
  });
});
