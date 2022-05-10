import { CurrencyDao } from '../database/dao/currency.dao';
import { CoinbaseIntegrationService } from './coinbase-integration.service';

export class CurrencyService {
  private coinbaseIntegrationService: CoinbaseIntegrationService;
  private currencyDao: CurrencyDao;

  constructor(coinbaseIntegrationService: CoinbaseIntegrationService, currencyDao: CurrencyDao) {
    this.coinbaseIntegrationService = coinbaseIntegrationService;
    this.currencyDao = currencyDao;
  }

  public async addRealCurrency(currency: any) {
    throw new Error('Method not implemented');
  }
}
