import CurrencyRateRepository from "@/application/repository/currency-rate-repository";
import EquivalentRateCalculator from "@/application/service/equivalent-rate-calculator";
import CurrencyRate from "@/domain/currency-rate";

export default class CreateCurrencyRate {
  constructor(private currencyRateRepository: CurrencyRateRepository) { }

  async execute(data: CreateCurrencyRateDto): Promise<Output> {
    const equivalentCurrencyRate = await this.currencyRateRepository.findByCode(data.equivalentCurrencyCode);
    const equivalentRateCalculator = new EquivalentRateCalculator(equivalentCurrencyRate.rate);
    const rate = equivalentRateCalculator.calculateRate(data.baseAmount, data.equivalentCurrencyAmount)
    const currencyRate = CurrencyRate.create(data.name, data.code, data.symbol, data.decimalPoints, rate);
    await this.currencyRateRepository.add(currencyRate);
    return { currencyRateId: currencyRate.id };
  }
}

export type CreateCurrencyRateDto = {
  name: string;
  symbol: string;
  code: string;
  decimalPoints: number;
  baseAmount: number;
  equivalentCurrencyCode: string;
  equivalentCurrencyAmount: number;
}

export type Output = {
  currencyRateId: string;
}
