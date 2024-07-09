import type { CurrencyRepositoryDomain } from "../../domain/CurrencyRepository";
import type { Currency } from "../../domain/Currency";
import { ExchangeRate } from "../../domain/ExchangeRate";
import CurrencyModel from "../models/CurrencyModel";
import ExchangeRateModel from "../models/ExchangeRateModel";
export class CurrencyRepository implements CurrencyRepositoryDomain {
    async getExchangeRate(from: Currency, to: Currency): Promise<ExchangeRate> {
        const exchangeRate = await ExchangeRateModel.findOne({
            from: from.code,
            to: to.code,
        }).exec();
        if (!exchangeRate) {
            throw new Error(
                `No exchange rate found for ${from.code} to ${to.code}`
            );
        }
        return new ExchangeRate(from, to, exchangeRate.rate as number);
    }

    async addCurrency(currency: Currency): Promise<void> {
        const newCurrency = new CurrencyModel({ code: currency.code });
        await newCurrency.save();
    }

    async removeCurrency(
        currency: Currency
    ): Promise<{ deletedCount: number }> {
        const { deletedCount } = await CurrencyModel.deleteOne({
            code: currency.code,
        }).exec();
        return { deletedCount };
    }

    async addExchangeRate(
        from: Currency,
        to: Currency,
        rate: number
    ): Promise<void> {
        const newRate = new ExchangeRateModel({
            from: from.code,
            to: to.code,
            rate,
        });
        await newRate.save();
    }
}
