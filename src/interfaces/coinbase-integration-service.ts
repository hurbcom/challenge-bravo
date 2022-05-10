import {
  CurrenciesResponse,
  ExchangeRatesResponse,
} from '../services/coinbase-integration.service';

export interface ICoinbaseIntegrationService {
  getCurrencies(): Promise<CurrenciesResponse>;
  getExchangeRates(): Promise<ExchangeRatesResponse>;
}
