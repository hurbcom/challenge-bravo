import CurrencyRate from "@/domain/currency-rate";

export default interface CurrencyRateRepository {
  findByCode(code: string): Promise<CurrencyRate>;
  add(currencyRate: CurrencyRate): Promise<void>;
  delete(code: string): Promise<void>;
}
