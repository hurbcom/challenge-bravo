import CurrencyConverter from "@/application/service/currency-converter";
import CurrencyRateRepository from "../repository/currency-rate-repository";

export default class ConvertCurrency {
  constructor(readonly currencyRateRepository: CurrencyRateRepository) {
  }

  async execute(input: Input): Promise<Output> {
    const exchangeFrom = await this.currencyRateRepository.findByCode(input.from);
    const exchangeTo = await this.currencyRateRepository.findByCode(input.to);
    const currencyConverter = new CurrencyConverter(exchangeFrom.rate, exchangeTo.rate);
    const convertedAmount = currencyConverter.convert(input.amount);
    return { value: convertedAmount }
  }
}

type Input = {
  from: string;
  to: string;
  amount: number;
}

type Output = {
  value: number;
}