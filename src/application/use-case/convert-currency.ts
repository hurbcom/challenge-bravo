import ExchangeRateGateway from "@/application/gateway/exchange-rate-gateway";
import CurrencyConverter from "@/domain/currency-converter";

export default class ConvertCurrency {
  constructor(readonly exchangeRateGateway: ExchangeRateGateway) {
  }

  async execute(input: Input): Promise<Output> {
    const exchangeFrom = await this.exchangeRateGateway.getExchangeRate(input.from);
    const exchangeTo = await this.exchangeRateGateway.getExchangeRate(input.to);
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