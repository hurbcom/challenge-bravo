import { CurrencyService } from '../../services/CurrencyService';
import type { Currency, CurrencyRepository } from '../../types';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let mockFiatRepository: jest.Mocked<CurrencyRepository>;
  let mockCryptoRepository: jest.Mocked<CurrencyRepository>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFiatRepository = {
      getRates: jest.fn().mockResolvedValue(
        new Map([
          ['BRL', 5],
          ['EUR', 0.85],
        ])
      ),
      getType: jest.fn().mockReturnValue('fiat'),
    };

    mockCryptoRepository = {
      getRates: jest.fn().mockResolvedValue(
        new Map([
          ['BTC', 1 / 30000], // BTC/USD
          ['ETH', 1 / 2000], // ETH/USD
        ])
      ),
      getType: jest.fn().mockReturnValue('crypto'),
    };

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    service = new CurrencyService(mockFiatRepository, mockCryptoRepository);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('initialize', () => {
    it('should initialize with default currencies', async () => {
      const currencies = await service.getAllCurrencies();

      expect(currencies).toHaveLength(7);
      expect(currencies.map((c) => c.code)).toContain('USD');
      expect(currencies.map((c) => c.code)).toContain('BRL');
      expect(currencies.map((c) => c.code)).toContain('EUR');
      expect(currencies.map((c) => c.code)).toContain('BTC');
      expect(currencies.map((c) => c.code)).toContain('ETH');
      expect(currencies.map((c) => c.code)).toContain('GOLD');
      expect(currencies.map((c) => c.code)).toContain('GTAS');
    });
  });

  describe('convert', () => {
    it('should correctly convert between fiat currencies', async () => {
      const result = await service.convert('USD', 'BRL', 100);
      expect(result).toBe(500); // 100 USD * 5 BRL
    });

    it('should correctly convert between crypto currencies', async () => {
      const result = await service.convert('BTC', 'ETH', 1);
      expect(result).toBe(15); // 1 BTC = 30000 USD, then 30000 USD = 15 ETH (30000/2000)
    });

    it('should throw an error when converting non-existent currency', async () => {
      await expect(service.convert('XXX', 'USD', 100)).rejects.toThrow('Currency not found');
    });
  });

  describe('addCurrency', () => {
    it('should successfully add a new currency', async () => {
      const newCurrency: Currency = {
        code: 'TEST',
        name: 'Test Currency',
        type: 'fiat',
        rate: 1.5,
      };

      await service.addCurrency(newCurrency);
      const currencies = await service.getAllCurrencies();

      expect(currencies.find((c) => c.code === 'TEST')).toBeTruthy();
    });

    it('should reject duplicate currency', async () => {
      const duplicateCurrency: Currency = {
        code: 'USD',
        name: 'US Dollar',
        type: 'fiat',
        rate: 1,
      };

      await expect(service.addCurrency(duplicateCurrency)).rejects.toThrow('Currency already exists');
    });
  });

  describe('removeCurrency', () => {
    it('should successfully remove a currency', async () => {
      await service.removeCurrency('BRL');
      const currencies = await service.getAllCurrencies();

      expect(currencies.find((c) => c.code === 'BRL')).toBeFalsy();
    });

    it('should not allow removing USD (base currency)', async () => {
      await expect(service.removeCurrency('USD')).rejects.toThrow('Cannot remove base currency (USD)');
    });

    it('should reject removal of non-existent currency', async () => {
      await expect(service.removeCurrency('XXX')).rejects.toThrow('Currency not found');
    });
  });

  describe('getAllCurrencies', () => {
    it('should return all currencies with updated rates', async () => {
      const currencies = await service.getAllCurrencies();

      expect(mockFiatRepository.getRates).toHaveBeenCalled();
      expect(mockCryptoRepository.getRates).toHaveBeenCalled();
      expect(currencies.find((c) => c.code === 'BRL')?.rate).toBe(5);
      expect(currencies.find((c) => c.code === 'BTC')?.rate).toBe(1 / 30000);
    });
  });

  describe('updateRates', () => {
    it('should not update rates if interval has not passed', async () => {
      await service.getAllCurrencies();
      await service.getAllCurrencies();

      expect(mockFiatRepository.getRates).toHaveBeenCalledTimes(1);
      expect(mockCryptoRepository.getRates).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when updating rates', async () => {
      mockFiatRepository.getRates.mockRejectedValueOnce(new Error('API Error'));

      await expect(service.getAllCurrencies()).rejects.toThrow('Failed to update currency rates');
    });
  });
});
