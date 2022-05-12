import { currencyService as CurrencyService } from '../../src/services';
import { ICurrencyService } from '../../src/interfaces/currency-service';
import { CoinbaseIntegrationService } from '../../src/services/coinbase-integration.service';
import {
  CurrencyAdded,
  CurrencyDeleted,
  CurrencyExchanged,
  CurrencyNotFound,
  FictitiousCurrencyAlreadyRegistered,
  InvalidFictitiousCurrencyCode,
  RealCurrencyAlreadyRegistered,
  RealCurrencyNotSupported,
} from '../../src/services/responses/currency-service.response';
import { CurrencyDao } from '../../src/database/dao/currency.dao';

describe('CurrencyService', () => {
  let currencyService: ICurrencyService;

  beforeAll(() => {
    currencyService = CurrencyService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when the method "addRealCurrency" is called', () => {
    it('should return RealCurrencyNotSupported error', async () => {
      const spy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getCurrencies')
        .mockResolvedValue({ data: [{ id: 'test', name: 'test', min_size: 'test' }] });

      const response = await currencyService.addRealCurrency('BRL');

      expect(spy).toHaveBeenCalled();
      expect(response).toBeInstanceOf(RealCurrencyNotSupported);
    });

    it('should return RealCurrencyAlreadyRegistered error', async () => {
      const coinbaseSpy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getCurrencies')
        .mockResolvedValue({ data: [{ id: 'BRL', name: 'test', min_size: 'test' }] });

      const dbSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValue({ code: 'BRL', rate: '5.13' });

      const response = await currencyService.addRealCurrency('BRL');

      expect(coinbaseSpy).toHaveBeenCalled();
      expect(dbSpy).toHaveBeenCalled();
      expect(response).toBeInstanceOf(RealCurrencyAlreadyRegistered);
    });

    it('should return CurrencyAdded', async () => {
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
        .mockResolvedValue({ code: 'BRL', rate: '5.13' });

      const response = await currencyService.addRealCurrency('BRL');

      expect(coinbaseCurrenciesSpy).toHaveBeenCalled();
      expect(coinbaseRatesSpy).toHaveBeenCalled();
      expect(daoGetByCodeSpy).toHaveBeenCalled();
      expect(daoSaveSpy).toHaveBeenCalled();
      expect(response).toBeInstanceOf(CurrencyAdded);
    });
  });

  describe('when the method "addFictitiousCurrency" is called', () => {
    it('should return InvalidFictitiousCurrencyCode error', async () => {
      const coinbaseCurrenciesSpy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getCurrencies')
        .mockResolvedValue({ data: [{ id: 'BRL', name: 'test', min_size: 'test' }] });

      const response = await currencyService.addFictitiousCurrency({
        currency: 'BRL',
        exchangeRate: '3.5',
      });

      expect(coinbaseCurrenciesSpy).toHaveBeenCalled();
      expect(response).toBeInstanceOf(InvalidFictitiousCurrencyCode);
    });

    it('should return FictitiousCurrencyAlreadyRegistered error', async () => {
      const coinbaseCurrenciesSpy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getCurrencies')
        .mockResolvedValue({ data: [{ id: 'BRL', name: 'test', min_size: 'test' }] });

      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValue({ code: 'HURB', rate: '3.5' });

      const response = await currencyService.addFictitiousCurrency({
        currency: 'HURB',
        exchangeRate: '3.5',
      });

      expect(coinbaseCurrenciesSpy).toHaveBeenCalled();
      expect(daoGetByCodeSpy).toHaveBeenCalled();
      expect(response).toBeInstanceOf(FictitiousCurrencyAlreadyRegistered);
    });

    it('should return CurrencyAdded', async () => {
      const coinbaseCurrenciesSpy = jest
        .spyOn(CoinbaseIntegrationService.prototype, 'getCurrencies')
        .mockResolvedValue({ data: [{ id: 'BRL', name: 'test', min_size: 'test' }] });

      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValue(null);

      const daoSaveSpy = jest
        .spyOn(CurrencyDao.prototype, 'save')
        .mockResolvedValue({ code: 'HURB', rate: '3.5' });

      const response = await currencyService.addFictitiousCurrency({
        currency: 'HURB',
        exchangeRate: '3.5',
      });

      expect(coinbaseCurrenciesSpy).toHaveBeenCalled();
      expect(daoGetByCodeSpy).toHaveBeenCalled();
      expect(daoSaveSpy).toHaveBeenCalled();
      expect(response).toBeInstanceOf(CurrencyAdded);
    });
  });

  describe('when the method "deleteCurrency" is called', () => {
    it('should return CurrencyNotFound error', async () => {
      const daoDeleteSpy = jest.spyOn(CurrencyDao.prototype, 'delete').mockResolvedValue(null);

      const response = await currencyService.deleteCurrency('BRL');

      expect(daoDeleteSpy).toHaveBeenCalled();
      expect(response).toBeInstanceOf(CurrencyNotFound);
    });

    it('should return CurrencyDeleted', async () => {
      const daoDeleteSpy = jest
        .spyOn(CurrencyDao.prototype, 'delete')
        .mockResolvedValue({ code: 'BRL', rate: '5.13' });

      const response = await currencyService.deleteCurrency('BRL');

      expect(daoDeleteSpy).toHaveBeenCalled();
      expect(response).toBeInstanceOf(CurrencyDeleted);
    });
  });

  describe('when the method "exchangeCurrencies" is called', () => {
    it('should return CurrencyNotFound from fromCurrency', async () => {
      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValue(null);

      const response = await currencyService.exchangeCurrencies('USD', 'BRL', '10');

      expect(daoGetByCodeSpy).toHaveBeenCalled();
      expect(response).toBeInstanceOf(CurrencyNotFound);
    });

    it('should return CurrencyNotFound from toCurrency', async () => {
      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValueOnce({ code: 'USD', rate: '1' })
        .mockResolvedValueOnce(null);

      const response = await currencyService.exchangeCurrencies('USD', 'BRL', '10');

      expect(daoGetByCodeSpy).toHaveBeenCalledTimes(2);
      expect(response).toBeInstanceOf(CurrencyNotFound);
    });

    it('should return CurrencyDeleted using different currencies', async () => {
      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValueOnce({ code: 'USD', rate: '1' })
        .mockResolvedValueOnce({ code: 'BRL', rate: '5.13' });

      const response = await currencyService.exchangeCurrencies('USD', 'BRL', '10');

      expect(daoGetByCodeSpy).toHaveBeenCalledTimes(2);
      expect(response).toBeInstanceOf(CurrencyExchanged);
    });

    it('should return CurrencyDeleted using the same currencies', async () => {
      const daoGetByCodeSpy = jest
        .spyOn(CurrencyDao.prototype, 'getByCode')
        .mockResolvedValue({ code: 'USD', rate: '1' });

      const response = await currencyService.exchangeCurrencies('USD', 'USD', '10');

      expect(daoGetByCodeSpy).toHaveBeenCalledTimes(1);
      expect(response).toBeInstanceOf(CurrencyExchanged);
    });
  });
});
