import { FastifyRequest, FastifyReply } from 'fastify';
import {
  convertCurrencyHandler,
  addCurrencyHandler,
  removeCurrencyHandler,
  getCurrencyHandler,
  getCurrenciesHandler
} from '../../src/controllers/currencyController';
import * as currencyService from '../../src/services/currencyService';

jest.mock('../../src/services/currencyService', () => ({
  convertCurrency: jest.fn(),
  addCurrency: jest.fn(),
  removeCurrency: jest.fn(),
  getCurrency: jest.fn(),
  getAllCurrencies: jest.fn()
}));

describe('Currency Controller', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockRequest = {};
    mockReply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  it('should handle currency conversion', async () => {
    const mockConvertedAmount = 85;
    (currencyService.convertCurrency as jest.Mock).mockResolvedValue(mockConvertedAmount);

    mockRequest.query = { from: 'USD', to: 'EUR', amount: '100' };

    await convertCurrencyHandler(mockRequest as FastifyRequest<{ Querystring: { from: string, to: string, amount: string } }>, mockReply as FastifyReply);

    expect(mockReply.send).toHaveBeenCalledWith({ convertedAmount: mockConvertedAmount });
    expect(currencyService.convertCurrency).toHaveBeenCalledWith('USD', 'EUR', 100);
  });

  it('should handle adding a currency', async () => {
    mockRequest.body = { code: 'BTC', type: 'CRYPTO', conversionRateToUSD: 50000 };

    await addCurrencyHandler(mockRequest as FastifyRequest<{ Body: { code: string, type: string, conversionRateToUSD?: number } }>, mockReply as FastifyReply);

    expect(mockReply.code).toHaveBeenCalledWith(201);
    expect(mockReply.send).toHaveBeenCalledWith({
      code: 'BTC',
      type: 'CRYPTO',
      conversionRateToUSD: 50000
    });
    expect(currencyService.addCurrency).toHaveBeenCalledWith('BTC', 'CRYPTO', 50000);
  });

  it('should handle removing a currency', async () => {
    mockRequest.params = { code: 'BTC' };

    await removeCurrencyHandler(mockRequest as FastifyRequest<{ Params: { code: string } }>, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(204);
    expect(mockReply.send).toHaveBeenCalled();
    expect(currencyService.removeCurrency).toHaveBeenCalledWith('BTC');
  });

  it('should handle getting a currency', async () => {
    const mockCurrency = { code: 'USD', type: 'FIAT', unit: 'Dollar' };
    (currencyService.getCurrency as jest.Mock).mockResolvedValue(mockCurrency);

    mockRequest.params = { code: 'USD' };

    await getCurrencyHandler(mockRequest as FastifyRequest<{ Params: { code: string } }>, mockReply as FastifyReply);

    expect(mockReply.send).toHaveBeenCalledWith(mockCurrency);
    expect(currencyService.getCurrency).toHaveBeenCalledWith('USD');
  });

  it('should handle getting all currencies', async () => {
    const mockCurrencies = [
      { code: 'USD', type: 'FIAT', unit: 'Dollar' },
      { code: 'EUR', type: 'FIAT', unit: 'Euro' }
    ];
    (currencyService.getAllCurrencies as jest.Mock).mockResolvedValue(mockCurrencies);

    await getCurrenciesHandler(mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.send).toHaveBeenCalledWith(mockCurrencies);
    expect(currencyService.getAllCurrencies).toHaveBeenCalled();
  });
});
