import { Currency } from "../../../../model/Currency";
import {
    ICurrenciesRepository,
    ICreateCurrencyDTO,
} from "../ICurrenciesRepository";

class CurrenciesRepository implements ICurrenciesRepository {
    private currencies: Currency[];

    private static INSTANCE: CurrenciesRepository;

    private constructor() {
        this.currencies = [];
    }

    public static getInstance(): CurrenciesRepository {
        if (!CurrenciesRepository.INSTANCE) {
            CurrenciesRepository.INSTANCE = new CurrenciesRepository();
        }
        return CurrenciesRepository.INSTANCE;
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
