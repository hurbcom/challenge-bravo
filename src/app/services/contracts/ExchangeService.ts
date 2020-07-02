import { injectable } from "inversify";

@injectable()
export default abstract class ExchangeService {

  getExchangeBetweenCurrencies(from: string, to: string, amount: number) {
    return { total: 0.00011 };
  }

  calculateExchange(sourceValue: number, targetValue: number, amount: number) {
    if (sourceValue < 0 || targetValue < 0 || amount < 0)
      throw new Error('Unable to calculate exchange with negative values');

    return (targetValue / sourceValue) * amount;
  }
}