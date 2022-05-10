import { coinbaseIntegrationService } from '../../services';
import { DatabaseSeeder } from '../database-seeder';
import { CurrencyDao } from './currency.dao';

const currencyDao = new CurrencyDao();
const databaseSeeder = new DatabaseSeeder(currencyDao, coinbaseIntegrationService);

export { currencyDao, databaseSeeder };
