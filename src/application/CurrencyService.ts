import type { CurrencyRepositoryDomain } from "../domain/CurrencyRepository";
import type { Currency } from "../domain/Currency";
import { MongooseError } from "mongoose";

export class CurrencyService {
    constructor(private currencyRepository: CurrencyRepositoryDomain) {}

    async convert(from: Currency, to: Currency, amount: number): Promise<number> {
        const exchangeRate = await this.currencyRepository.getExchangeRate(
            from,
            to
        );
        return amount * exchangeRate?.rate;
    }

    async addCurrency(currency: Currency): Promise<void> {
        await this.currencyRepository.addCurrency(currency);
    }

    async removeCurrency(
        currency: Currency
    ): Promise<{ deletedCount: number }> {
        const result = await this.currencyRepository.removeCurrency(currency);
        return result;
    }

    async addExchangeRate(
        from: Currency,
        to: Currency,
        rate: number
    ): Promise<void> {
        await this.currencyRepository.addExchangeRate(from, to, rate);
    }
}
