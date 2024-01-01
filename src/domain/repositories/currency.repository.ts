import CurrencyEntity, { CurrencyEntityProps } from '../entities/currency.entity';
import { CurrencyApi } from '../entities/dto/currency-api-response.dto';
import { CurrencyResponse } from '../entities/dto/currency-response.dto';

export default interface CurrencyRepository {
    findBy(currencyEntityProps: Partial<CurrencyEntityProps>): Promise<CurrencyEntity[] | null>;
    findAll(): Promise<CurrencyEntityProps[] | null>;
    findAllApi(): Promise<CurrencyResponse[] | null>;
    insert(currencyEntity: CurrencyEntity): Promise<CurrencyEntity>;
    update(currencyId: string, currencyEntity: CurrencyEntity): Promise<void>;
    findByApi(code: string): Promise<CurrencyResponse | null>;
    convertCurrency(from: string, to: string, amount: number): Promise<CurrencyApi | null>;
}