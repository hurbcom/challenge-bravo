import { IResponseCurrency } from "../infra/services/ExchangeApiService";

interface IExchangeApiService {
  getCurrency(currencyCode: string): Promise<IResponseCurrency>;
}

export { IExchangeApiService };
