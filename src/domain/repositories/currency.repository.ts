import CurrencyEntity, { CurrencyEntityProps } from '../entities/currency.entity';

export default interface CurrencyRepository {
    findBy(currencyEntityProps: Partial<CurrencyEntityProps>): Promise<CurrencyEntity[] | null>;
    findAll(currencyEntityProps: Partial<CurrencyEntityProps>): Promise<CurrencyEntity[] | null>;
    insert(currencyEntity: CurrencyEntity): Promise<CurrencyEntity>;
    update(currencyEntity: CurrencyEntity): Promise<CurrencyEntity>;
}