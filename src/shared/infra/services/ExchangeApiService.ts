import { AxiosResponse } from "axios";
import { injectable } from "tsyringe";

import { AppError } from "../../errors/AppError";
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
    let response: AxiosResponse;

    try {
      response = await api.get("/list");
    } catch (err) {
      throw new AppError(`Unexpected integration error - ${err.message}`, 500);
    }

    const result = response.data as IResponseCurrenciesList;
    return result;
  }
  async getCurrencyUsdPrice(currencyCode: string): Promise<number> {
    let response: AxiosResponse;

    try {
      response = await api.get("/live", {
        params: {
          currencies: currencyCode,
        },
      });
    } catch (err) {
      throw new AppError(`Unexpected integration error - ${err.message}`, 500);
    }

    const result = response.data as IResponseCurrencyUsdPrice;
    const code = `${this.base_currency}${currencyCode}`;

    return result.quotes[code];
  }
}

export { exchangeApiService };
