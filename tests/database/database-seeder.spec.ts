import { ICurrencyDao } from '../../src/database/dao/currency.dao';
import { ICoinbaseIntegrationService } from '../../src/services/coinbase-integration.service';
import { CoinbaseIntegrationService } from '../../src/services/coinbase-integration.service';
import { CurrencyDao } from '../../src/database/dao/currency.dao';
import { currencyDao } from '../../src/database/dao';
import { DatabaseMemoryServer } from '../database-memory-server';
import { coinbaseIntegrationService } from '../../src/services';
import { DatabaseSeeder } from '../../src/database/database-seeder';
import { databaseSeeder } from '../../src/database';
import { data as exchangeRates } from '../exchangeRatesResponse.json';
import { CurrencyType } from '../../src/model/currency';

describe('DatabaseSeeder', () => {
  let dao: ICurrencyDao;
  let databaseMemoryServer: DatabaseMemoryServer;
  let coinbaseService: ICoinbaseIntegrationService;
  let seeder: DatabaseSeeder;

  beforeAll(async () => {
    dao = currencyDao;
    coinbaseService = coinbaseIntegrationService;
    seeder = databaseSeeder;
  });

  describe('when the method "run" is called', () => {
    it('should skeep the seed because the database has already been initialized previously', async () => {
      const currencyDaoSpy = jest
        .spyOn(CurrencyDao.prototype, 'getAllCurrencies')
        .mockResolvedValueOnce([{ code: 'BRL', exchangeRate: '5.13', type: CurrencyType.REAL }]);

      const coinbaseServiceSpy = jest.spyOn(
        CoinbaseIntegrationService.prototype,
        'getExchangeRates',
      );

      const daoSpy = jest.spyOn(CurrencyDao.prototype, 'save');

      await seeder.run();

      expect(currencyDaoSpy).toHaveBeenCalled();
      expect(coinbaseServiceSpy).not.toHaveBeenCalled();
      expect(daoSpy).not.toHaveBeenCalled();
    });

    it('should add the base currencies to the database', async () => {
      databaseMemoryServer = await DatabaseMemoryServer.setup();
      await databaseMemoryServer.connect();

      const currencyDaoSpy = jest
        .spyOn(CurrencyDao.prototype, 'getAllCurrencies')
        .mockResolvedValueOnce([]);

      const coinbaseServiceSpy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getExchangeRates')
        .mockResolvedValueOnce(exchangeRates.data);

      const daoSpy = jest.spyOn(CurrencyDao.prototype, 'save');

      await seeder.run();

      await databaseMemoryServer.clearDatabase();
      await databaseMemoryServer.disconnectAndStop();

      expect(currencyDaoSpy).toHaveBeenCalled();
      expect(coinbaseServiceSpy).toHaveBeenCalled();
      expect(daoSpy).toHaveBeenCalledTimes(5);
    });
  });
});
