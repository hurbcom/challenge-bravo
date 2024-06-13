import { CurrencyRate } from "@/domain/entity/";

export interface CurrencyRateRepository {
  findByCode(code: string): Promise<CurrencyRate>;
  add(currencyRate: CurrencyRate): Promise<void>;
  delete(code: string): Promise<void>;
}

export default CurrencyRateRepository;