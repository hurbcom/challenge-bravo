import { IResponseCurrenciesList } from "../infra/services/ExchangeApiService";

interface IExchangeApiService {
  getAllCurrenciesNames(): Promise<IResponseCurrenciesList>;
  getCurrencyUsdPrice(currencyCode: string): Promise<number>;
}

export { IExchangeApiService };
