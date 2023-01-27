import { Currency } from "../entities/Currency";

interface IConvertedCoins {
    from: string;
    to: string;
    amount: string;
}
interface ICreateCurrencyDTO {
    code: string;
    name: string;
    codein?: string;
    ask: string;
    type?: string;
}

interface ICurrencyRepository {
    findByCode(code: string): Promise<Currency>;
    list(): Promise<Currency[]>;
    create({ code, name, ask }: ICreateCurrencyDTO): Promise<void>;
    defaultCoins(): Promise<void>;
    convertCoins({ from, to, amount }: IConvertedCoins): Promise<number>;
}

export { ICurrencyRepository, ICreateCurrencyDTO, IConvertedCoins };
