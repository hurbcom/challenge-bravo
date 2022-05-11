import { ICoinbaseIntegrationService } from '../interfaces/coinbase-integration-service';
import { HttpClient } from '../web/http-client';

export type CurrenciesResponse = {
  data: [
    {
      id: string;
      name: string;
      min_size: string;
    },
  ];
};

export type ExchangeRatesResponse = {
  currency: string;
  rates: {
    [currency: string]: string;
  };
};

export class CoinbaseIntegrationService implements ICoinbaseIntegrationService {
  constructor(private readonly httpClient: HttpClient) {}

  public async getCurrencies() {
    const { COINBASE_API_URL } = process.env;
    const response = await this.httpClient.makeRequest({
      method: 'GET',
      url: `${COINBASE_API_URL}/currencies`,
    });

    return response.data as CurrenciesResponse;
  }

  public async getExchangeRates(): Promise<ExchangeRatesResponse> {
    const { COINBASE_API_URL } = process.env;
    const response = await this.httpClient.makeRequest({
      method: 'GET',
      url: `${COINBASE_API_URL}/exchange-rates`,
    });
    return response.data?.data as ExchangeRatesResponse;
  }
}
