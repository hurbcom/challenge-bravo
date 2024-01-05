import CurrencyEntity, {
    CurrencyEntityProps,
} from "../entities/currency.entity";
import { CurrencyResponseDto } from "../entities/dto/currency-response.dto";
import CurrencyRepository from "../repositories/currency.repository";

export default class ShowCurrencyUseCase {
    constructor(private readonly currencyRepository: CurrencyRepository) {}

    async execute(
        currencyEntityProps: CurrencyEntityProps
    ): Promise<CurrencyResponseDto | null> {
        try {
            const currencyResponse = await this.currencyRepository.findBy({
                code: currencyEntityProps.code,
            });

            return currencyResponse ?? null;
        } catch (e) {
            return null;
        }
    }
}
