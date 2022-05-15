import { Currency, CurrencyType } from '../model/currency';
import { ICoinbaseIntegrationService } from '../services/coinbase-integration.service';
import { ICurrencyDao } from './dao/currency.dao';

export class DatabaseSeeder {
  private readonly BASE_CURRENCIES = ['USD', 'BRL', 'EUR', 'BTC', 'ETH'];

  constructor(
    private readonly currencyDao: ICurrencyDao,
    private readonly coinbaseIntegrationService: ICoinbaseIntegrationService,
  ) {}

  public async run() {
    const dbCurrencies = await this.currencyDao.getAllCurrencies();

    if (dbCurrencies.length > 0) {
      console.log('The database has already been initialized previously.');
      console.log('Skeeping seed!');
      return;
    }

    const { rates } = await this.coinbaseIntegrationService.getExchangeRates();

    for (const baseCurrency of this.BASE_CURRENCIES) {
      const currency = new Currency({
        code: baseCurrency,
        exchangeRate: rates[baseCurrency],
        type: CurrencyType.REAL,
      });
      await this.currencyDao.save(currency);
    }
  }
}
