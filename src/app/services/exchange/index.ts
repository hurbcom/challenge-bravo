import { injectable } from "inversify";

@injectable()
export default abstract class ExchangeService {

  getExchangeBetweenCurrencies(from: string, to: string, amount: number) {
    return { total: 0.00011 };
  }
}