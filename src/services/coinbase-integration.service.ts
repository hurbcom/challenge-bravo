import { HttpClient } from '../web/http-client';

export class CoinbaseIntegrationService {
  constructor(private readonly httpClient: HttpClient) {}

  public async getCurrencies() {
    const { COINBASE_API_URL } = process.env;
    const response = await this.httpClient.makeRequest({
      method: 'GET',
      url: `${COINBASE_API_URL}/currencies`,
    });
    return response.data;
  }

  public async getExchangeRates() {
    const { COINBASE_API_URL } = process.env;
    const response = await this.httpClient.makeRequest({
      method: 'GET',
      url: `${COINBASE_API_URL}/exchange-rates`,
    });
    return response.data?.data;
  }
}
