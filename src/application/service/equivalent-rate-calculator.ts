export class EquivalentRateCalculator {

  constructor(readonly equivalentCurrencyRate: number) { }

  calculateRate(baseAmount: number, equivalentCurrencyAmount: number): number {
    if (baseAmount <= 0) {
      throw new Error('Invalid attribute: baseAmount');
    }
    if (equivalentCurrencyAmount <= 0) {
      throw new Error('Invalid attribute: equivalentCurrencyAmount');
    }
    const rate = baseAmount / equivalentCurrencyAmount * this.equivalentCurrencyRate;
    return rate
  }

}

export default EquivalentRateCalculator;
