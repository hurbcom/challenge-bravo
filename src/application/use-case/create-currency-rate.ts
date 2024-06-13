import { CurrencyRateRepository } from "@/application/repository";
import { EquivalentRateCalculator } from "@/application/service";
import { CurrencyRate } from "@/domain/entity/";

export class CreateCurrencyRate {
  constructor(private currencyRateRepository: CurrencyRateRepository) { }

  async execute(input: CreateCurrencyRateDto): Promise<CreateCurrencyRateOutput> {
    const equivalentCurrencyRate = await this.currencyRateRepository.findByCode(input.equivalentCurrencyCode.toUpperCase());
    const equivalentRateCalculator = new EquivalentRateCalculator(equivalentCurrencyRate.rate);
    const rate = equivalentRateCalculator.calculateRate(input.baseAmount, input.equivalentCurrencyAmount)
    const currencyRate = CurrencyRate.create(input.name, input.code, input.symbol, input.decimalPoints, rate);
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

export type CreateCurrencyRateOutput = {
  currencyRateId: string;
}

export default CreateCurrencyRate;