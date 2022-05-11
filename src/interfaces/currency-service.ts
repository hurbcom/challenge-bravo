import {
  CurrencyAdded,
  CurrencyDeleted,
  CurrencyExchanged,
} from '../services/responses/currency-service.response';
import { ServiceResponse } from '../services/responses/service.response';

export interface ICurrencyService {
  addRealCurrency(currencyCode: string): Promise<ServiceResponse<CurrencyAdded | void>>;
  addFictitiousCurrency(currencyInput: any): Promise<ServiceResponse<CurrencyAdded | void>>;
  deleteCurrency(currencyCode: any): Promise<ServiceResponse<CurrencyDeleted | void>>;
  exchangeCurrencies(
    from: string,
    to: string,
    amount: string,
  ): Promise<ServiceResponse<CurrencyExchanged | void>>;
}
