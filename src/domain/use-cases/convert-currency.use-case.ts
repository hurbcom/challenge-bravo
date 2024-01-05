import { CurrencyApiResponseDto } from "../entities/dto/currency-api-response.dto";
import CurrencyRepository from "../repositories/currency.repository";

export default class ConvertCurrencyUseCase {
    constructor(private readonly currencyRepository: CurrencyRepository) {}
    async execute(
        from: string,
        to: string,
        amount: number
    ): Promise<CurrencyApiResponseDto | null> {
        return await this.currencyRepository.convertCurrency(from, to, amount);
    }
}
