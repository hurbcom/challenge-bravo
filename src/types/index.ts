import { FastifyRequest } from 'fastify';

export interface Currency {
  code: string;
  name: string;
  type: 'fiat' | 'crypto' | 'fictional';
  rate: number;
}

export interface ConversionRequest {
  from: string;
  to: string;
  amount: number;
}

export interface CurrencyRepository {
  getRates(): Promise<Map<string, number>>;
  getType(): string;
}

export interface CurrencyControllerConvertAction extends ConversionRequest {
  result: number;
  rate: number;
}

export interface CurrencyController {
  convertAction(req: FastifyRequest): Promise<CurrencyControllerConvertAction>;
  addCurrencyAction(req: FastifyRequest): Promise<Currency>;
  deleteCurrencyAction(req: FastifyRequest): Promise<void>;
  getAllCurrenciesAction(): Promise<Currency[]>;
}

export interface CurrencyService {
  convert(from: string, to: string, amount: number): Promise<number>;
  addCurrency(currency: Currency): Promise<void>;
  removeCurrency(code: string): Promise<void>;
  getAllCurrencies(): Promise<Currency[]>;
}
