import { CurrencyRateRepository } from "@/application/repository";

export class ConvertCurrency {
  constructor(readonly currencyRateRepository: CurrencyRateRepository) {
  }

  async execute(input: ConvertCurrencyDto): Promise<ConvertCurrencyResponse> {
    const exchangeFrom = await this.currencyRateRepository.findByCode(input.from);
    const exchangeTo = await this.currencyRateRepository.findByCode(input.to);
    const convertedAmount = exchangeFrom.convertTo(exchangeTo, input.amount);
    return {
      value: convertedAmount,
      symbol: exchangeTo.symbol,
      decimalPoints: exchangeTo.decimalPoints
    }
  }
}

export type ConvertCurrencyDto = {
  from: string;
  to: string;
  amount: number;
}

export type ConvertCurrencyResponse = {
  value: number;
  symbol: string;
  decimalPoints: number;
}

export default ConvertCurrency;