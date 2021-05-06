import { Currency } from "../../../model/Currency";

interface ICreateCurrencyDTO {
    symbol: string;
}

interface ICurrenciesRepository {
    findBySymbol(symbol: string): Currency | undefined;
    list(): Currency[];
    create({ symbol }: ICreateCurrencyDTO): void;
}

export { ICurrenciesRepository, ICreateCurrencyDTO };
