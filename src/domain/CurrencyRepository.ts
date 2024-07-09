import type { Currency } from "./Currency";
import type { ExchangeRate } from "./ExchangeRate";

export interface CurrencyRepositoryDomain {
    getExchangeRate(from: Currency, to: Currency): Promise<ExchangeRate>;
    addCurrency(currency: Currency): Promise<void>;
    removeCurrency(currency: Currency): Promise<{ deletedCount: number }>;
    addExchangeRate(from: Currency, to: Currency, rate: number): Promise<void>;
}
