import { EquivalentRateCalculator } from "@/application/service/";

describe('equivalent-rate-calculator', () => {

  it('should calculate the equivalent rate of BRL in USD', async () => {
    const equivalentRateCalculator = new EquivalentRateCalculator(1);
    expect(equivalentRateCalculator.calculateRate(5.20, 1.00)).toBe(5.20);
    expect(equivalentRateCalculator.calculateRate(10.40, 2.00)).toBe(5.20);
  });

  it('should calculate the equivalent rate of GTA$ in BRL', async () => {
    const equivalentRateCalculator = new EquivalentRateCalculator(5.20);
    const equivalentRate = equivalentRateCalculator.calculateRate(1250000.00, 83.50);
    expect(equivalentRate).toBe(77844.31137724551);
  });

  it('should throw an error when the base amount is invalid', async () => {
    const equivalentRateCalculator = new EquivalentRateCalculator(1);
    expect(() => equivalentRateCalculator.calculateRate(-1, 1)).toThrow('Invalid param: baseAmount');
  });

  it('should throw an error when the equivalent currency amount is invalid', async () => {
    const equivalentRateCalculator = new EquivalentRateCalculator(1);
    expect(() => equivalentRateCalculator.calculateRate(1, -1)).toThrow('Invalid param: equivalentCurrencyAmount');
  });

});