import { FastifyRequest } from 'fastify';
import { CurrencyController } from '../../controllers/CurrencyController';
import { Currency, CurrencyService as ICurrencyService } from '../../types';

describe('CurrencyController', () => {
  let currencyController: CurrencyController;
  let mockCurrencyService: jest.Mocked<ICurrencyService>;

  beforeEach(() => {
    // Cria um mock completo usando a interface ICurrencyService
    mockCurrencyService = {
      convert: jest.fn(),
      addCurrency: jest.fn(),
      removeCurrency: jest.fn(),
      getAllCurrencies: jest.fn(),
    } as jest.Mocked<ICurrencyService>;

    currencyController = new CurrencyController(mockCurrencyService);
  });

  describe('convertAction', () => {
    it('should convert currency correctly', async () => {
      const mockRequest = {
        query: {
          from: 'USD',
          to: 'BRL',
          amount: 100,
        },
      } as FastifyRequest;

      const expectedResult = 500; // 100 USD = 500 BRL
      mockCurrencyService.convert.mockResolvedValue(expectedResult);

      const result = await currencyController.convertAction(mockRequest);

      expect(result).toEqual({
        from: 'USD',
        to: 'BRL',
        amount: 100,
        result: expectedResult,
        rate: 5, // 500/100
      });
      expect(mockCurrencyService.convert).toHaveBeenCalledWith('USD', 'BRL', 100);
    });

    it('should throw an error when conversion fails', async () => {
      const mockRequest = {
        query: {
          from: 'USD',
          to: 'BRL',
          amount: 100,
        },
      } as FastifyRequest;

      mockCurrencyService.convert.mockRejectedValue(new Error('Falha na conversão'));

      await expect(currencyController.convertAction(mockRequest)).rejects.toThrow('Error convert');
    });
  });

  describe('getAllCurrenciesAction', () => {
    it('should return all currencies', async () => {
      const mockCurrencies: Currency[] = [
        { code: 'USD', name: 'US Dollar', type: 'fiat', rate: 1 },
        { code: 'BRL', name: 'Brazilian Real', type: 'fiat', rate: 5 },
      ];

      mockCurrencyService.getAllCurrencies.mockResolvedValue(mockCurrencies);

      const result = await currencyController.getAllCurrenciesAction();

      expect(result).toEqual(mockCurrencies);
      expect(mockCurrencyService.getAllCurrencies).toHaveBeenCalled();
    });
  });

  describe('addCurrencyAction', () => {
    it('should add a new currency', async () => {
      const newCurrency: Currency = {
        code: 'EUR',
        name: 'Euro',
        type: 'fiat',
        rate: 0.85,
      };

      const mockRequest = {
        body: newCurrency,
      } as FastifyRequest;

      mockCurrencyService.addCurrency.mockResolvedValue(undefined);

      const result = await currencyController.addCurrencyAction(mockRequest);

      expect(result).toEqual(newCurrency);
      expect(mockCurrencyService.addCurrency).toHaveBeenCalledWith(newCurrency);
    });
  });

  describe('deleteCurrencyAction', () => {
    it('should remove a currency', async () => {
      const mockRequest = {
        params: { code: 'EUR' },
      } as FastifyRequest;

      mockCurrencyService.removeCurrency.mockResolvedValue(undefined);

      await currencyController.deleteCurrencyAction(mockRequest);

      expect(mockCurrencyService.removeCurrency).toHaveBeenCalledWith('EUR');
    });
  });
});
