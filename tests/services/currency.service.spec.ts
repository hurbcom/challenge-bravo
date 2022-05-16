import { currencyService as CurrencyService } from '../../src/services';
import { ICurrencyService } from '../../src/services/currency.service';
import { CoinbaseIntegrationService } from '../../src/services/coinbase-integration.service';
import { CurrencyDao } from '../../src/database/dao/currency.dao';
import { CurrencyType } from '../../src/model/currency';

describe('CurrencyService', () => {
  let currencyService: ICurrencyService;

  beforeAll(() => {
    currencyService = CurrencyService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when the method "addCurrency" is called', () => {
    it('should throw ExchangeRateForRealCurrencyNotAllowed', async () => {
      const spy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getCurrencies')
        .mockResolvedValue({ data: [{ id: 'BRL', name: 'test', min_size: 'test' }] });

      await expect(
        currencyService.addCurrency({ code: 'BRL', exchangeRate: '5.13' }),
      ).rejects.toThrow(
        'The currency BRL is listed as a real currency and you cannot set the exchange rate.',
      );
      expect(spy).toHaveBeenCalled();
    });

    it('should throw ExchangeRateNotInformedForFictitiousCurrency', async () => {
      const coinbaseSpy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getCurrencies')
        .mockResolvedValue({ data: [{ id: 'BRL', name: 'test', min_size: 'test' }] });

      await expect(
        currencyService.addCurrency({ code: 'HURB', exchangeRate: null }),
      ).rejects.toThrow('The fictitious currency HURB must have an exchange rate.');

      expect(coinbaseSpy).toHaveBeenCalled();
    });

    it('should throw CurrencyAlreadyRegistered', async () => {
      const coinbaseCurrenciesSpy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getCurrencies')
        .mockResolvedValue({ data: [{ id: 'BRL', name: 'test', min_size: 'test' }] });

      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValue({ code: 'BRL', exchangeRate: '5.13', type: CurrencyType.REAL });

      const coinbaseRatesSpy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getExchangeRates')
        .mockResolvedValue({ currency: 'USD', rates: { BRL: '5.13' } });

      const daoSaveSpy = jest
        .spyOn(CurrencyDao.prototype, 'save')
        .mockResolvedValue({ code: 'BRL', exchangeRate: '5.13', type: CurrencyType.REAL });

      await expect(
        currencyService.addCurrency({ code: 'BRL', exchangeRate: null }),
      ).rejects.toThrow('The currency BRL is already registered in the database.');

      expect(coinbaseCurrenciesSpy).toHaveBeenCalled();
      expect(daoGetByCodeSpy).toHaveBeenCalled();
      expect(coinbaseRatesSpy).not.toHaveBeenCalled();
      expect(daoSaveSpy).not.toHaveBeenCalled();
    });

    it('should return real currency added', async () => {
      const coinbaseCurrenciesSpy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getCurrencies')
        .mockResolvedValue({ data: [{ id: 'BRL', name: 'test', min_size: 'test' }] });

      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValue(null);

      const coinbaseRatesSpy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getExchangeRates')
        .mockResolvedValue({ currency: 'USD', rates: { BRL: '5.13' } });

      const daoSaveSpy = jest
        .spyOn(CurrencyDao.prototype, 'save')
        .mockResolvedValue({ code: 'BRL', exchangeRate: '5.13', type: CurrencyType.REAL });

      const result = await currencyService.addCurrency({ code: 'BRL', exchangeRate: null });

      expect(coinbaseCurrenciesSpy).toHaveBeenCalled();
      expect(daoGetByCodeSpy).toHaveBeenCalled();
      expect(coinbaseRatesSpy).toHaveBeenCalled();
      expect(daoSaveSpy).toHaveBeenCalled();
      expect(result.code).toEqual('BRL');
    });

    it('should return fictitious currency added', async () => {
      const coinbaseCurrenciesSpy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getCurrencies')
        .mockResolvedValue({ data: [{ id: 'BRL', name: 'test', min_size: 'test' }] });

      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValue(null);

      const coinbaseRatesSpy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getExchangeRates')
        .mockResolvedValue({ currency: 'USD', rates: { BRL: '5.13' } });

      const daoSaveSpy = jest
        .spyOn(CurrencyDao.prototype, 'save')
        .mockResolvedValue({ code: 'HURB', exchangeRate: '2.5', type: CurrencyType.FICTITIOUS });

      const result = await currencyService.addCurrency({ code: 'HURB', exchangeRate: '2.5' });

      expect(coinbaseCurrenciesSpy).toHaveBeenCalled();
      expect(daoGetByCodeSpy).toHaveBeenCalled();
      expect(coinbaseRatesSpy).not.toHaveBeenCalled();
      expect(daoSaveSpy).toHaveBeenCalled();
      expect(result.code).toEqual('HURB');
      expect(result.exchangeRate).toEqual('2.5');
      expect(result.type).toEqual(CurrencyType.FICTITIOUS);
    });
  });

  describe('when the method "deleteCurrency" is called', () => {
    it('should return CurrencyNotFound error', async () => {
      const daoDeleteSpy = jest.spyOn(CurrencyDao.prototype, 'delete').mockResolvedValue(null);

      await expect(currencyService.deleteCurrency('BRL')).rejects.toThrow(
        'The currency BRL was not found in the database.',
      );
      expect(daoDeleteSpy).toHaveBeenCalled();
    });

    it('should return CurrencyDeleted', async () => {
      const daoDeleteSpy = jest
        .spyOn(CurrencyDao.prototype, 'delete')
        .mockResolvedValue({ code: 'BRL', exchangeRate: '5.13', type: CurrencyType.REAL });

      const response = await currencyService.deleteCurrency('BRL');

      expect(daoDeleteSpy).toHaveBeenCalled();
      expect(response.code).toEqual('BRL');
    });
  });

  describe('when the method "getCurrencies" is called', () => {
    it('should return all currencies', async () => {
      const mockedList = [
        { code: 'BRL', exchangeRate: '5.13', type: CurrencyType.REAL },
        { code: 'USD', exchangeRate: '1', type: CurrencyType.REAL },
      ];

      const currencyDaospy = jest
        .spyOn(CurrencyDao.prototype, 'getAllCurrencies')
        .mockResolvedValue(mockedList);

      const currencyList = await currencyService.getCurrencies(null);

      expect(currencyList).toBeDefined();
      expect(currencyDaospy).toHaveBeenCalled();
      expect(currencyList).toEqual(mockedList);
    });

    it('should return currencies of a specific type', async () => {
      const mockedList = [
        { code: 'BRL', exchangeRate: '5.13', type: CurrencyType.REAL },
        { code: 'USD', exchangeRate: '1', type: CurrencyType.REAL },
      ];

      const currencyDaospy = jest
        .spyOn(CurrencyDao.prototype, 'getCurrenciesByType')
        .mockResolvedValue(mockedList);

      const currencyList = await currencyService.getCurrencies(CurrencyType.REAL);

      expect(currencyList).toBeDefined();
      expect(currencyDaospy).toHaveBeenCalled();
      expect(currencyList).toEqual(mockedList);
    });
  });

  describe('when the method "exchangeCurrencies" is called', () => {
    it('should return CurrencyNotFound from fromCurrency', async () => {
      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValue(null);

      await expect(currencyService.exchangeCurrencies('USD', 'BRL', '10')).rejects.toThrow(
        'The currency USD was not found in the database.',
      );
      expect(daoGetByCodeSpy).toHaveBeenCalled();
    });

    it('should return CurrencyNotFound from toCurrency', async () => {
      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValueOnce({ code: 'USD', exchangeRate: '1', type: CurrencyType.REAL })
        .mockResolvedValueOnce(null);

      await expect(currencyService.exchangeCurrencies('USD', 'BRL', '10')).rejects.toThrow(
        'The currency BRL was not found in the database.',
      );
      expect(daoGetByCodeSpy).toHaveBeenCalledTimes(2);
    });

    it('should return CurrencyDeleted using different currencies', async () => {
      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValueOnce({ code: 'USD', exchangeRate: '1', type: CurrencyType.REAL })
        .mockResolvedValueOnce({ code: 'BRL', exchangeRate: '5.13', type: CurrencyType.REAL });

      const response = await currencyService.exchangeCurrencies('USD', 'BRL', '10');

      expect(daoGetByCodeSpy).toHaveBeenCalledTimes(2);
      // expect(response).toBeInstanceOf(CurrencyExchanged);
    });

    it('should return CurrencyDeleted using the same currencies', async () => {
      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValue({ code: 'USD', exchangeRate: '1', type: CurrencyType.REAL });

      const response = await currencyService.exchangeCurrencies('USD', 'USD', '10');

      expect(daoGetByCodeSpy).toHaveBeenCalledTimes(1);
      // expect(response).toBeInstanceOf(CurrencyExchanged);
    });
  });
});
