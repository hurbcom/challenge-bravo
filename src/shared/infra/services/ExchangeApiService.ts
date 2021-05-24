import { injectable } from "tsyringe";

import { IExchangeApiService } from "../../services/IExchangeApiService";
import { api } from "../http/axios/api";

export interface IResponseCurrenciesList {
  currencies: any;
}

interface IResponseCurrencyUsdPrice {
  quotes: any;
}

@injectable()
class exchangeApiService implements IExchangeApiService {
  private readonly base_currency = "USD";
  async getAllCurrenciesNames(): Promise<IResponseCurrenciesList> {
    const response = await api.get("/list");
    const result = response.data as IResponseCurrenciesList;
    console.log("busquei todos os nomes!!!!");
    return result;
  }
  async getCurrencyUsdPrice(currencyCode: string): Promise<number> {
    const response = await api.get("/live", {
      params: {
        currencies: currencyCode,
      },
    });

    const result = response.data as IResponseCurrencyUsdPrice;
    const code = `${this.base_currency}${currencyCode}`;
    return result.quotes[code];
  }
}

export { exchangeApiService };
