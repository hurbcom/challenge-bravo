import { EquivalentRateCalculator } from '@/application/service/';

describe('equivalent-rate-calculator', () => {
  it('should calculate the equivalent rate of BRL in USD', async () => {
    const equivalentRateCalculator = new EquivalentRateCalculator(1);
    expect(equivalentRateCalculator.calculateRate(5.2, 1.0)).toBe(5.2);
    expect(equivalentRateCalculator.calculateRate(10.4, 2.0)).toBe(5.2);
  });

  it('should calculate the equivalent rate of GTA$ in BRL', async () => {
    const equivalentRateCalculator = new EquivalentRateCalculator(5.2);
    const equivalentRate = equivalentRateCalculator.calculateRate(
      1250000.0,
      83.5
    );
    expect(equivalentRate).toBe(77844.31137724551);
  });

  it('should throw an error when the base amount is invalid', async () => {
    const equivalentRateCalculator = new EquivalentRateCalculator(1);
    expect(() => equivalentRateCalculator.calculateRate(-1, 1)).toThrow(
      'Invalid param: baseAmount'
    );
  });

  it('should throw an error when the equivalent currency amount is invalid', async () => {
    const equivalentRateCalculator = new EquivalentRateCalculator(1);
    expect(() => equivalentRateCalculator.calculateRate(1, -1)).toThrow(
      'Invalid param: equivalentCurrencyAmount'
    );
  });
});
