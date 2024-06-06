import { EquivalentRateCalculator } from "@/application/service/equivalent-rate-calculator";
import CurrencyConverter from "@/domain/currency-converter";

describe('equivalent-rate-calculator', () => {

  it('should calculate the equivalent rate R$', async () => {
    const equivalentRateCalculator = new EquivalentRateCalculator(1);
    const equivalentRate = equivalentRateCalculator.calculateRate(10.40, 2.00);
    const conversor = new CurrencyConverter(1, equivalentRate);
    const convertedAmount = conversor.convert(2);
    expect(convertedAmount).toBe(10.40);
  });

  it('should calculate the equivalent rate of GTA$', async () => {
    const equivalentRateCalculator = new EquivalentRateCalculator(5.20);
    const equivalentRate = equivalentRateCalculator.calculateRate(1250000.00, 83.50);
    expect(equivalentRate).toBe(77844.31137724551);
    const conversor = new CurrencyConverter(5.20, equivalentRate);
    const convertedAmount = conversor.convert(83.50);
    expect(convertedAmount).toBe(1250000.00);
  });

});