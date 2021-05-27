import { AxiosResponse } from "axios";
import { injectable } from "tsyringe";

import { AppError } from "../../errors/AppError";
import { IExchangeApiService } from "../../services/IExchangeApiService";
import { api } from "../http/axios/api";

export interface IResponseCurrency {
  asset_id: string;
  name: string;
  price_usd: number;
}

@injectable()
class exchangeApiService implements IExchangeApiService {
  async getCurrency(currencyCode: string): Promise<IResponseCurrency> {
    let response: AxiosResponse;

    try {
      response = await api.get(`/${currencyCode}`);
    } catch (err) {
      throw new AppError(`Unexpected integration error - ${err.message}`, 500);
    }

    const result = response.data as IResponseCurrency[];

    if (!result || !result.length) {
      return null;
    }

    return {
      asset_id: result[0].asset_id,
      name: result[0].name,
      price_usd: result[0].price_usd,
    };
  }
}

export { exchangeApiService };
