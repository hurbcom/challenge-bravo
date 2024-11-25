import axios from 'axios';
import { appConfig } from '../../config/application';
import { FiatCurrencyRepository } from '../../repositories/FiatCurrencyRepository';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FiatCurrencyRepository', () => {
  let repository: FiatCurrencyRepository;
  const API_URL = `${appConfig.EXCHANGE_RATE_API}/latest/USD`;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    repository = new FiatCurrencyRepository();
    jest.clearAllMocks();
    // Silencia o console.error durante os testes
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('getRates', () => {
    it('should return fiat currency rates correctly', async () => {
      const mockResponse = {
        data: {
          rates: {
            EUR: 0.85,
            BRL: 5.0,
            GBP: 0.73,
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const rates = await repository.getRates();

      expect(mockedAxios.get).toHaveBeenCalledWith(API_URL);
      expect(rates.get('EUR')).toBe(0.85);
      expect(rates.get('BRL')).toBe(5.0);
      expect(rates.get('GBP')).toBe(0.73);
    });

    it('should throw an error when API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(repository.getRates()).rejects.toThrow('Failed to fetch fiat currency rates');
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching fiat rates:', expect.any(Error));
    });
  });

  describe('getType', () => {
    it('should return the correct type', () => {
      expect(repository.getType()).toBe('fiat');
    });
  });
});
