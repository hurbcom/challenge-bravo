import { CurrencyDao } from '../database/dao/currency.dao';
import Currency from '../model/currency';
import { CoinbaseIntegrationService } from './coinbase-integration.service';
import {
  RealCurrencyAdded,
  RealCurrencyAlreadyRegistered,
  RealCurrencyNotSupported,
} from './responses/currency-service.response';

export class CurrencyService {
  constructor(
    private readonly currencyDao: CurrencyDao,
    private readonly coinbaseIntegrationService: CoinbaseIntegrationService,
  ) {}

  public async addRealCurrency(currencyCode: any) {
    const { data: apiCurrencies } = await this.coinbaseIntegrationService.getCurrencies();

    const isIncluded = apiCurrencies.some((currency) => currency.id === currencyCode);
    if (!isIncluded) {
      return new RealCurrencyNotSupported(currencyCode);
    }

    const dbCurrency = await this.currencyDao.getByCode(currencyCode);
    if (dbCurrency) {
      return new RealCurrencyAlreadyRegistered(currencyCode);
    }

    const { rates } = await this.coinbaseIntegrationService.getExchangeRates();

    const currency = new Currency({ code: currencyCode, rate: rates[currencyCode] });
    const currencyAdded = await this.currencyDao.save(currency);
    console.log('currencyAdded', currencyAdded);

    return new RealCurrencyAdded(currencyAdded);
  }
}
