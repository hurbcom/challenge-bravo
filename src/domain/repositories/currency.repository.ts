import CurrencyEntity, { CurrencyEntityProps } from '../entities/currency.entity';
import { CurrencyResponse } from '../entities/dto/currency-response.dto';

export default interface CurrencyRepository {
    findBy(currencyEntityProps: Partial<CurrencyEntityProps>): Promise<CurrencyEntity[] | null>;
    findAll(currencyEntityProps: Partial<CurrencyEntityProps>): Promise<CurrencyEntity[] | null>;
    findAllApi(currencyEntityProps: Partial<CurrencyEntityProps>): Promise<CurrencyResponse[] | null>;
    insert(currencyEntity: CurrencyEntity): Promise<CurrencyEntity>;
    update(currencyEntity: CurrencyEntity): Promise<CurrencyEntity>;
}