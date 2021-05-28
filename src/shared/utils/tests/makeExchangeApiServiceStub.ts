import { IResponseCurrency } from "../../infra/services/ExchangeApiService";
import { IExchangeApiService } from "../../services/IExchangeApiService";

const makeExchangeApiService = (): IExchangeApiService => {
  class ExchangeApiServiceStub implements IExchangeApiService {
    async getCurrency(currencyCode: string): Promise<IResponseCurrency> {
      const response: IResponseCurrency = {
        asset_id: currencyCode.toLocaleUpperCase(),
        name: `${currencyCode} currency Test`,
        price_usd: 5,
      };

      return response;
    }
  }

  return new ExchangeApiServiceStub();
};

export { makeExchangeApiService };
