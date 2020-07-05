import { injectable } from "inversify";

export interface CurrencySymbol {
  name: string,
  symbol: string
}

export interface ExchangeResult {
  from: string,
  to: string,
  amount: number,
  exchangeRate: number,
  total: number
}

@injectable()
export default abstract class ExchangeService {

  abstract getExchangeBetweenCurrencies(from: string, to: string, amount: number): Promise<ExchangeResult>;

  calculateExchange(rate: number, amount: number) {
    if (rate < 0 || amount < 0)
      throw new Error('Unable to calculate exchange with negative values');

    return rate * amount;
  }
}