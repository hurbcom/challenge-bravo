import CurrencyRate from "@/domain/currency-rate";

export default interface CurrencyRateRepository {
  findById(id: string): Promise<CurrencyRate>;
  findByCode(code: string): Promise<CurrencyRate>;
  add(currencyRate: CurrencyRate): Promise<void>;
  save(currencyRate: CurrencyRate): Promise<void>;
  delete(id: string): Promise<void>;
}
