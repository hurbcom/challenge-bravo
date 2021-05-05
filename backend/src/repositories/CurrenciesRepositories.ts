import { Currency } from "../model/Currency";

interface ICreateCurrencyDTO {
    symbol: string;
}

class CurrenciesRepository {
    private currencies: Currency[];

    constructor() {
        this.currencies = [];
    }

    create({ symbol }: ICreateCurrencyDTO): void {
        const currency = new Currency();

        Object.assign(currency, {
            symbol,
        });

        this.currencies.push(currency);
    }

    list(): Currency[] {
        return this.currencies;
    }

    findBySymbol(symbol: string): Currency | undefined {
        const currency = this.currencies.find(
            (currency) => currency.symbol === symbol
        );

        return currency;
    }
}

export { CurrenciesRepository };
