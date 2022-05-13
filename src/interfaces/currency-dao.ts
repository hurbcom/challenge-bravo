import { CurrencyDto } from '../model/currency';

export interface ICurrencyDao {
  getAllCurrencies(): Promise<CurrencyDto[]>;
  getCurrenciesByType(currencyType: string): Promise<CurrencyDto[]>;
  getByCode(currencyCode: string): Promise<CurrencyDto>;
  save(currency: CurrencyDto): Promise<CurrencyDto>;
  update(filter: any, update: any): Promise<any>;
  delete(currencyCode: string): Promise<CurrencyDto>;
}
