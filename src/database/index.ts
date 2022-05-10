import { coinbaseIntegrationService } from '../services';
import { currencyDao } from './dao';
import { DatabaseSeeder } from './database-seeder';

const databaseSeeder = new DatabaseSeeder(currencyDao, coinbaseIntegrationService);

export { databaseSeeder };
