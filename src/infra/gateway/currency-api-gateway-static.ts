import { CurrenciesResponse, CurrencyApiGateway, Filters, RateResponse } from "@/infra/gateway/";
import { readFileSync } from 'fs';
import path from 'path';

export class CurrenciesApiGatewayStatic implements CurrencyApiGateway {
  private currenciesMap: Map<string, CurrenciesResponse['data'][1]>;
  private ratesMap: Map<string, RateResponse['data'][1]>;
  private lastUpdatedAt!: Date;

  constructor() {
    this.currenciesMap = new Map();
    this.ratesMap = new Map();
    this.loadData();
  }

  private async loadData(): Promise<void> {
    const currenciesFilePath = path.resolve(__dirname, './api.currencyapi-v3-currencies.json');
    const ratesFilePath = path.resolve(__dirname, './api.currencyapi-v3-latest.json');

    const currenciesData = readFileSync(currenciesFilePath, 'utf-8');
    const ratesData = readFileSync(ratesFilePath, 'utf-8');

    const currenciesResponse: CurrenciesResponse = JSON.parse(currenciesData);
    const ratesResponse: RateResponse = JSON.parse(ratesData);

    this.lastUpdatedAt = ratesResponse.meta.last_updated_at;

    for (const [code, currency] of Object.entries(currenciesResponse.data)) {
      this.currenciesMap.set(code, currency);
    }

    for (const [code, rate] of Object.entries(ratesResponse.data)) {
      this.ratesMap.set(code, rate);
    }
  }

  async getCurrencies(filters?: Filters): Promise<CurrenciesResponse> {
    const filteredCurrencies = Array.from(this.currenciesMap.entries()).reduce((acc, [code, currency]) => {
      if (
        (!filters?.currencies || filters.currencies.includes(code)) &&
        (!filters?.type || currency.type === filters.type)
      ) {
        acc[code] = currency;
      }
      return acc;
    }, {} as { [key: string]: any });

    return { data: filteredCurrencies };
  }

  async getRates(filters?: Filters): Promise<RateResponse> {
    const filteredRates = Array.from(this.ratesMap.entries()).reduce((acc, [code, rate]) => {
      if (
        (!filters?.currencies || filters.currencies.includes(code)) &&
        (!filters?.type || this.currenciesMap.get(code)?.type === filters.type)
      ) {
        acc[code] = rate;
      }
      return acc;
    }, {} as { [key: string]: any });


    return {
      meta: { last_updated_at: this.lastUpdatedAt },
      data: filteredRates
    };
  }
}
