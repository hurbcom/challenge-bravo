import { CreateCurrencyExchange, CurrencyExchange } from "@/domain/entity";

export const CURRENCY_REPOSITORY = "CURRENCY REPOSITORY";

export interface CurrencyRepository {
    getByCode(code: string): Promise<CurrencyExchange>;
    findAll(): Promise<CurrencyExchange[]>;
    create(currencyExchange: CreateCurrencyExchange): Promise<CurrencyExchange>;
    update(code: string, value: number): Promise<CurrencyExchange>;
    remove(code: string): Promise<void>;
}
