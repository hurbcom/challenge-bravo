import CurrencyRateRepository from "../repository/currency-rate-repository";

export default class ConvertCurrency {
  constructor(readonly currencyRateRepository: CurrencyRateRepository) {
  }

  async execute(input: Input): Promise<Output> {
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

type Input = {
  from: string;
  to: string;
  amount: number;
}

type Output = {
  value: number;
  symbol: string;
  decimalPoints: number;
}