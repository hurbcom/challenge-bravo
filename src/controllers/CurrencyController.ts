import { FastifyRequest } from 'fastify';
import {
  ConversionRequest,
  Currency,
  CurrencyControllerConvertAction,
  CurrencyController as ICurrencyController,
  CurrencyService as ICurrencyService,
} from '../types';

export class CurrencyController implements ICurrencyController {
  private currencyService: ICurrencyService;

  constructor(currencyService: ICurrencyService) {
    this.currencyService = currencyService;
  }

  async convertAction(request: FastifyRequest): Promise<CurrencyControllerConvertAction> {
    const { from, to, amount } = request.query as ConversionRequest;
    try {
      const result = await this.currencyService.convert(from, to, amount);
      const rate = result / amount;

      return { from, to, amount, result, rate };
    } catch (error: any) {
      throw new Error('Error convert', error);
    }
  }

  async getAllCurrenciesAction(): Promise<Currency[]> {
    return this.currencyService.getAllCurrencies();
  }

  async addCurrencyAction(request: FastifyRequest): Promise<Currency> {
    const currency = request.body as Currency;
    await this.currencyService.addCurrency(currency);

    return currency;
  }

  async deleteCurrencyAction(request: FastifyRequest): Promise<void> {
    const { code } = request.params as { code: string };
    await this.currencyService.removeCurrency(code);
  }
}
