import { ICurrencyDao } from '../interfaces/currency-dao';
import { Currency } from '../model/currency';
import { CoinbaseIntegrationService } from '../services/coinbase-integration.service';

export class DatabaseSeeder {
  private readonly BASE_CURRENCIES = ['USD', 'BRL', 'EUR', 'BTC', 'ETH'];

  constructor(
    private readonly currencyDao: ICurrencyDao,
    private readonly coinbaseIntegrationService: CoinbaseIntegrationService,
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
      const currency = new Currency({ code: baseCurrency, rate: rates[baseCurrency] });
      await this.currencyDao.save(currency);
    }
  }
}
