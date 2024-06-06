import CurrencyRate from "@/domain/currency-rate";

export default interface CurrencyRateRepository {
  findByCode(code: string): Promise<CurrencyRate>;
  add(currencyRate: CurrencyRate): Promise<void>;
  delete(id: string): Promise<void>;
}
