import { CurrencyDto } from '../model/currency';
import { ServiceResponse } from '../services/responses/service.response';

export interface ICurrencyService {
  addCurrency(currencyDto: CurrencyDto): Promise<CurrencyDto>;
  deleteCurrency(currencyCode: any): Promise<CurrencyDto>;
  exchangeCurrencies(from: string, to: string, amount: string): Promise<any>;
}
