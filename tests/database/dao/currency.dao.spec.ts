import { ICurrencyDao } from '../../../src/interfaces/currency-dao';
import { currencyDao as CurrencyDao } from '../../../src/database/dao';
import { DatabaseMemoryServer } from '../../database-memory-server';

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
      expect(response.code).toEqual(currencyDto.code);
    });

    it('should throw an error because code is null', async () => {
      const currencyDto = { code: null, rate: '5.13' };

      await expect(currencyDao.save(currencyDto)).rejects.toThrow();
    });

    it('should throw an error because rate is null', async () => {
      const currencyDto = { code: 'BRL', rate: null };

      await expect(currencyDao.save(currencyDto)).rejects.toThrow();
    });
  });

  describe('when the method "getAllCurrencies" is called', () => {
    it('should return all currencies in an array', async () => {
      const currencyDto = { code: 'BRL', rate: '5.13' };
      await currencyDao.save(currencyDto);

      const currenciesList = await currencyDao.getAllCurrencies();

      expect(currenciesList).toBeDefined();
      expect(currenciesList.length).toEqual(1);
    });
  });

  describe('when the method "getByCode" is called', () => {
    it('should return a currency', async () => {
      const currencyCode = 'BRL';
      const currencyDto = { code: currencyCode, rate: '5.13' };
      await currencyDao.save(currencyDto);

      const result = await currencyDao.getByCode(currencyCode);

      expect(result).toBeDefined();
      expect(result.code).toEqual(currencyCode);
    });
  });

  describe('when the method "update" is called', () => {
    it('should return the currency updated', async () => {
      const currencyRate = '5.0';
      const currencyRateUpdated = '5.13';
      const currencyDto = { code: 'BRL', rate: currencyRate };
      await currencyDao.save(currencyDto);

      const result = await currencyDao.update({ code: 'BRL' }, { rate: currencyRateUpdated });

      expect(result).toBeDefined();
      expect(result.modifiedCount).toEqual(1);
    });
  });

  describe('when the method "delete" is called', () => {
    it('should return the deleted currency', async () => {
      const currencyCode = 'BRL';
      const currencyDto = { code: currencyCode, rate: '5.13' };
      await currencyDao.save(currencyDto);

      const deletedCurrency = await currencyDao.delete(currencyCode);
      const dbCurrency = await currencyDao.getByCode(currencyCode);
      console.log('dbCurrency', dbCurrency);

      expect(deletedCurrency).toBeDefined();
      expect(deletedCurrency.code).toEqual(currencyCode);
      expect(dbCurrency).toEqual(null);
    });
  });
});
