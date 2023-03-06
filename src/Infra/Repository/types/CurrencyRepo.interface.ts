import { type Currency } from "../../../Entities/Currency";

export interface ICurrencyRepository {
    getAllCurrencies: () => Promise<Currency[]>;
    getCurrency: (currencyId: string) => Promise<Currency | null>;
    setCurrency: (currency: Currency) => Promise<void>;
    deleteCurrency: (currencyId: string) => Promise<void>;
    getDollarRate: (currencyId: string) => Promise<number | null>;
    setDollarRate: (currencyId: string, value: number) => Promise<void>;
}
