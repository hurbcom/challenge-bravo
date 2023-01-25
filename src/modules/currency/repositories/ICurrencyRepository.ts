import { Currency } from "../entities/Currency";

interface IAwsomeApi {
    code: string;
    codein: string;
    name: string;
    high: string;
    low: string;
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
}

export { ICurrencyRepository, ICreateCurrencyDTO, IAwsomeApi };
