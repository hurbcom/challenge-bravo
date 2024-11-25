import axios from 'axios';
import { appConfig } from '../../config/application';
import { CryptoCurrencyRepository } from '../../repositories/CryptoCurrencyRepository';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CryptoCurrencyRepository', () => {
  let repository: CryptoCurrencyRepository;
  const API_URL = `${appConfig.COIN_GECKO_API}/simple/price`;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    repository = new CryptoCurrencyRepository();
    jest.clearAllMocks();
    // Silencia o console.error durante os testes
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('getRates', () => {
    it('should return cryptocurrency rates correctly', async () => {
      const mockResponse = {
        data: {
          bitcoin: { usd: 50000 },
          ethereum: { usd: 2000 },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const rates = await repository.getRates();

      expect(mockedAxios.get).toHaveBeenCalledWith(API_URL, {
        params: {
          ids: 'bitcoin,ethereum',
          vs_currencies: 'usd',
        },
      });

      expect(rates.get('BTC')).toBe(1 / 50000);
      expect(rates.get('ETH')).toBe(1 / 2000);
    });

    it('should throw an error when API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(repository.getRates()).rejects.toThrow('Failed to fetch cryptocurrency rates');
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching crypto rates:', expect.any(Error));
    });
  });

  describe('getType', () => {
    it('should return the correct type', () => {
      expect(repository.getType()).toBe('crypto');
    });
  });
});
