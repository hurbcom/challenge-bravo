import cron from 'node-cron';
import { Database } from '../database/database';
import { coinbaseIntegrationService as CoinbaseIntegrationService } from '../services/';
import { currencyDao as CurrencyDao } from '../database/dao';

export class UpdateCurrencyExchangeRatesJob {
  static async run(): Promise<void> {
    const { UPDATE_EXCHANGE_RATES_TIME } = process.env;

    cron.schedule(UPDATE_EXCHANGE_RATES_TIME, async () => {
      try {
        console.log('--- Initializing UpdateCurrenciesExchangeRateJob ---');
        await Database.connect();

        let count = 0;
        const currencyDao = CurrencyDao;
        const coinbaseIntegrationService = CoinbaseIntegrationService;

        const { rates } = await coinbaseIntegrationService.getExchangeRates();
        const currencies = await currencyDao.getAllCurrencies();

        for (const currency of currencies) {
          await currencyDao.update({ code: currency.code }, { exchangeRate: rates[currency.code] });
          count++;
        }

        console.log(`Total updated: ${count}.`);
        console.log('Finishing UpdateCurrenciesExchangeRateJob.');
      } catch (e) {
        console.log('Error while trying to update the exchange rates of the currencies', e);
      }
    });
  }
}

UpdateCurrencyExchangeRatesJob.run();
