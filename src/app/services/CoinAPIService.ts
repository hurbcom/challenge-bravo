
import { injectable, inject } from "inversify";
import types from "@core/types";
import ExchangeService from "@services/contracts/ExchangeService";
import UnsupportedSymbolError from "@utils/errors/UnsuportedSymbolError";
import ExchangeRateError from "@utils/errors/ExchangeRateError";
import ExchangeRepository from "../repositories/ExchangeRepository";
import CurrencyRepository from "../repositories/CurrencyRepository";

@injectable()
export default class CoinAPIService extends ExchangeService {

  constructor(
    @inject(types.ExchangeRepository) private exchangeRepository: ExchangeRepository,
    @inject(types.CurrencyRepository) private currencyRepository: CurrencyRepository) {
    super();
  }

  async getExchangeBetweenCurrencies(from: string, to: string, amount: number) {
    const sourceCurrency = await this.currencyRepository.findBySymbol(from);
    const targetCurrency = await this.currencyRepository.findBySymbol(to);

    if (!sourceCurrency || !targetCurrency)
      throw new UnsupportedSymbolError("One or more of currencies in this operation are not supported by the application");

    const exchangeRate = await this.exchangeRepository.getExchangeRate(from, to);

    if (!exchangeRate || exchangeRate < 0) {
      console.log(`Invalid exchange rate: ${exchangeRate}`);
      throw new ExchangeRateError("Could not determine the exchange rate between currencies");
    }

    const total = this.calculateExchange(exchangeRate, amount);

    return { from, to, amount, exchangeRate, total };
  }

}