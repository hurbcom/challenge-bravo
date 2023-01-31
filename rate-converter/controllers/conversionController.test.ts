import { Request, Response } from 'express';
import { RequestQuery, RequestParams, RequestBody, ResponseBody } from './conversion.types';
import { conversionController } from './conversion.controller';

jest.mock('../services/exchangeRate.service', () => ({
    getExchangeRate: jest.fn().mockResolvedValue(0.8),
  }));

describe('conversionController', () => {

    it('should return the converted amount', async () => {

        const req = {
            query: {
              from: 'USD',
              to: 'EUR',
              amount: 100,
            },
          };
          const res = {
            send: jest.fn(),
            status: jest.fn(),
          };

          // Call the controller
          await conversionController(req as any, res as any);

          // Assert that the response was sent with the expected data
          expect(res.send).toHaveBeenCalledWith({
            success: true,
            from: 'USD',
            to: 'EUR',
            amount: 100,
            convertedAmount: 80,
          });
    });

  it('should return an error if amount is not a number', async () => {
    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res: Response<ResponseBody> = { send, status } as any;
    const req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery> = {
      query: { from: 'USD', to: 'EUR', amount: 'invalid' },
    } as any;

    await conversionController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      error: 'Invalid amount',
    });
  });

  it('should return an error if currency codes are invalid', async () => {
    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res: Response<ResponseBody> = { send, status } as any;
    const req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery> = {
      query: { from: 'aBc', to: 'EUROAC', amount: 10 },
    } as any;

    await conversionController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      error: 'Invalid currency code format',
    });
  });
});