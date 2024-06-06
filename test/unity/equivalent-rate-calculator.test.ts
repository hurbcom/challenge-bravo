import { EquivalentRateCalculator } from "@/application/service/equivalent-rate-calculator";

describe('equivalent-rate-calculator', () => {

  it('should calculate the equivalent rate R$', async () => {
    const equivalentRateCalculator = new EquivalentRateCalculator(1);
    const equivalentRate = equivalentRateCalculator.calculateRate(10.40, 2.00);
    expect(equivalentRate).toBe(5.20);
  });

  it('should calculate the equivalent rate of GTA$', async () => {
    const equivalentRateCalculator = new EquivalentRateCalculator(5.20);
    const equivalentRate = equivalentRateCalculator.calculateRate(1250000.00, 83.50);
    expect(equivalentRate).toBe(77844.31137724551);
  });

});