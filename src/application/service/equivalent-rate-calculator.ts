import InvalidParamError from "@/domain/errors/invalid-param.error";

export class EquivalentRateCalculator {

  constructor(readonly equivalentCurrencyRate: number) { }

  calculateRate(baseAmount: number, equivalentCurrencyAmount: number): number {
    if (baseAmount <= 0) {
      throw new InvalidParamError('Invalid param: baseAmount');
    }
    if (equivalentCurrencyAmount <= 0) {
      throw new InvalidParamError('Invalid param: equivalentCurrencyAmount');
    }
    const rate = baseAmount / equivalentCurrencyAmount * this.equivalentCurrencyRate;
    return rate
  }

}

export default EquivalentRateCalculator;
