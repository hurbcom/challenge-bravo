import { ICurrencyDao } from '../../../src/interfaces/currency-dao';
import { currencyDao as CurrencyDao } from '../../../src/database/dao';
import { DatabaseMemoryServer } from '../database-memory-server';

describe('CurrencyDao', () => {
  let currencyDao: ICurrencyDao;
  let databaseMemoryServer: DatabaseMemoryServer;

  beforeAll(async () => {
    currencyDao = CurrencyDao;
    databaseMemoryServer = await DatabaseMemoryServer.setup();
    await databaseMemoryServer.connect();
  });

  afterEach(async () => {
    await databaseMemoryServer.clearDatabase();
  });

  afterAll(async () => {
    await databaseMemoryServer.disconnectAndStop();
  });

  describe('when the method "save" is called', () => {
    it('should add a new currency in the database and return it', async () => {
      const currencyDto = { code: 'BRL', rate: '5.13' };

      const response = await currencyDao.save(currencyDto);

      expect(response).toBeDefined();
      expect(response.code).toBe(currencyDto.code);
    });

    it('should throw an error because coded is null', async () => {
      const currencyDto = { code: null, rate: '5.13' };

      await expect(currencyDao.save(currencyDto)).rejects.toThrow();
    });
  });
});
