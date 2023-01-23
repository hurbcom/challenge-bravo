import { Currency } from "../entities/Currency";

interface ICreateCurrencyDTO {
    code: string;
    name: string;
    high: string;
    low: string;
}

interface ICurrencyRepository {
    findByCode(code: string): Promise<Currency>;
    list(): Promise<Currency[]>;
    create({ code, name, high, low }: ICreateCurrencyDTO): Promise<void>;
}

export { ICurrencyRepository, ICreateCurrencyDTO };
