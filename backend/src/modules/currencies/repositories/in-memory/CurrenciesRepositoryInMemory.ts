import { Currency } from "@modules/currencies/infra/typeorm/entities/Currency";
import {
    ICurrenciesRepository,
    ICreateCurrencyDTO,
} from "@modules/currencies/repositories/ICurrenciesRepository";

class CurrenciesRepositoryInMemory implements ICurrenciesRepository {
    currencies: Currency[] = [];

    async findBySymbol(symbol: string): Promise<Currency | undefined> {
        const currency = this.currencies.find(
            (currency) => currency.symbol === symbol
        );
        return currency;
    }
    async list(): Promise<Currency[]> {
        const all = this.currencies;
        return all;
    }
    async create({ symbol }: ICreateCurrencyDTO): Promise<void> {
        const currency = new Currency();

        Object.assign(currency, {
            symbol,
        });

        this.currencies.push(currency);
    }

    async delete({ symbol }: ICreateCurrencyDTO): Promise<void> {
        const currency = await this.currencies.find(
            (currency) => currency.symbol === symbol
        );
        const index = this.currencies.indexOf(currency);
        if (index > -1) {
            this.currencies.splice(index, 1);
        }
    }
}

export { CurrenciesRepositoryInMemory };
