import { Currency } from "../entities/Currency";

interface IConvertedCoins {
    from: string;
    to: string;
    amount: number;
}
interface ICreateCurrencyDTO {
    code: string;
    codein: string;
    name: string;
    high: string;
    low: string;
    type?: string;
}

interface ICurrencyRepository {
    findByCode(code: string): Promise<Currency>;
    list(): Promise<Currency[]>;
    create({
        code,
        codein,
        name,
        high,
        low,
    }: ICreateCurrencyDTO): Promise<void>;
    defaultCoins(): Promise<void>;
    convertCoins({ from, to, amount }: IConvertedCoins): Promise<number>;
}

export { ICurrencyRepository, ICreateCurrencyDTO, IConvertedCoins };
