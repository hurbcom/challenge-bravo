import { type Currency } from "../../Entities/Currency";

export interface ICurrencyService {
    getConversion: (
        originCurrencyId: string,
        outCurrencyId: string,
        amount: number
    ) => Promise<{ total: number }>;
    createCurrency: (data: Currency) => Promise<void>;
}
