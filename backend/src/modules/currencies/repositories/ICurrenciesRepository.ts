import { Currency } from "../../entities/Currency";

interface ICreateCurrencyDTO {
    symbol: string;
}

interface ICurrenciesRepository {
    findBySymbol(symbol: string): Promise<Currency | undefined>;
    list(): Promise<Currency[]>;
    create({ symbol }: ICreateCurrencyDTO): Promise<void>;
}

export { ICurrenciesRepository, ICreateCurrencyDTO };
