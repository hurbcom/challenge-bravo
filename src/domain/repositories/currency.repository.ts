import CurrencyEntity, {
    CurrencyEntityProps,
} from "../entities/currency.entity";
import { CurrencyApiResponseDto } from "../entities/dto/currency-api-response.dto";
import { CurrencyResponseDto } from "../entities/dto/currency-response.dto";

export default interface CurrencyRepository {
    findBy(
        currencyEntityProps: Partial<CurrencyEntityProps>
    ): Promise<CurrencyEntity[] | null>;
    findAll(): Promise<CurrencyEntityProps[] | null>;
    findAllApi(): Promise<CurrencyResponseDto[] | null>;
    insert(currencyEntity: CurrencyEntity): Promise<CurrencyEntity>;
    update(code: string, currencyEntity: CurrencyEntity): Promise<CurrencyResponseDto>;
    findByApi(code: string): Promise<CurrencyResponseDto | null>;
    convertCurrency(
        from: string,
        to: string,
        amount: number
    ): Promise<CurrencyApiResponseDto | null>;
    deleteCurrency(id: string): Promise<void>;
}
