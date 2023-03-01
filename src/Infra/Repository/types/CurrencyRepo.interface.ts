import { type Currency } from "../../../Entities/Currency.interface";

export interface ICurrencyRepository {
    getCurrency: (currencyId: string) => Promise<Currency | null>;
    setCurrency: (currency: Currency) => Promise<void>;
    getDollarRate: (currencyId: string) => Promise<number | null>;
    setDollarRate: (currencyId: string, value: number) => Promise<void>;
}
