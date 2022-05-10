import { CoinbaseIntegrationService } from './coinbase-integration.service';
import { httpClient } from '../web';
import { CurrencyService } from './currency.service';
import { currencyDao } from '../database/dao';

const coinbaseIntegrationService = new CoinbaseIntegrationService(httpClient);
const currencyService = new CurrencyService(coinbaseIntegrationService, currencyDao);

export { coinbaseIntegrationService, currencyService };
