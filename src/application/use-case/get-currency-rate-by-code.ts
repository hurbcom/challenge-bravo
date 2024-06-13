import { CurrencyRateRepository } from '@/application/repository';

export class GetCurrencyRateByCode {
  constructor(readonly currencyRateRepository: CurrencyRateRepository) {}

  async execute(code: string): Promise<GetCurrencyRateByCodeOutput> {
    const currencyRate = await this.currencyRateRepository.findByCode(code);
    return {
      id: currencyRate.id,
      name: currencyRate.name,
      code: currencyRate.code,
      symbol: currencyRate.symbol,
      decimalPoints: currencyRate.decimalPoints,
      rate: currencyRate.rate,
    };
  }
}

export type GetCurrencyRateByCodeOutput = {
  id: string;
  name: string;
  code: string;
  symbol: string;
  decimalPoints: number;
  rate: number;
};

export default GetCurrencyRateByCode;
