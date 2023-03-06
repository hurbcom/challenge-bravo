import { injectable } from "inversify";
import { type Currency } from "../../Entities/Currency";
import { type ICurrencyRepository } from "../../Infra/Repository/types/CurrencyRepo.interface";

const currencyData: Record<string, Currency> = {
    BRL: {
        id: "BRL",
        sourceType: "coingate",
    },
    USD: {
        id: "USD",
        sourceType: "coingate",
    },
    EUR: {
        id: "EUR",
        sourceType: "coingate",
    },
    TES: {
        id: "TES",
        sourceType: "fixed",
        dollarRate: 0.7,
    },
};
const currencyDollarData: Record<string, number> = {
    BRL: 0.1928156874843337,
    USD: 1,
    EUR: 1.0606815939922993,
};

@injectable()
export class CurrencyRepositoryMock implements ICurrencyRepository {
    async getAllCurrencies() {
        return Object.values(currencyData);
    }

    async getCurrency(id: string) {
        return currencyData[id];
    }

    async deleteCurrency(id: string) {}

    async getDollarRate(id: string) {
        return currencyDollarData[id];
    }

    async setDollarRate(id: string, value: number) {}
    async setCurrency(currency: Currency) {}
}
