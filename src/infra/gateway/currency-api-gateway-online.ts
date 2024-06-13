import {
  CurrenciesResponse,
  CurrencyApiGateway,
  Filters,
  RateResponse,
} from '@/infra/gateway/';
import { HttpClient } from '@/infra/http-client';

export class CurrenciesApiGatewayOnline implements CurrencyApiGateway {
  constructor(private readonly httpClient: HttpClient) {
    httpClient.setSettings({
      baseURL: 'https://api.currencyapi.com/v3/',
      headers: {
        apiKey: 'cur_live_cuO1rc3J9p5XJE9QYRgyadj3ERuP57GKFUdt9yOh',
      },
    });
  }

  getCurrencies(filters?: Filters): Promise<CurrenciesResponse> {
    const params: { [key: string]: any } = {
      ...(filters?.currencies && { currencies: filters.currencies }),
      ...(filters?.type && { type: filters.type }),
    };
    return this.httpClient.get<CurrenciesResponse>('/currencies', { params });
  }

  getRates(filters?: Filters): Promise<RateResponse> {
    const params: { [key: string]: any } = {
      ...(filters?.currencies && { currencies: filters.currencies }),
      ...(filters?.type && { type: filters.type }),
    };
    return this.httpClient.get<RateResponse>('/latest', { params });
  }
}
