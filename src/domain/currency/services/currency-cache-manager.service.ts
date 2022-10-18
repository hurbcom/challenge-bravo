import { Currency } from '../entities/currency.entity';

export interface CurrencyCacheManager {
  getCache(key: string): Promise<Currency | null>;
  setCache(key: string, value: Currency): Promise<string>;
}