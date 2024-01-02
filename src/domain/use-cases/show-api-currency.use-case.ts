import { CurrencyResponse } from "../entities/dto/currency-response.dto";
import CurrencyRepository from "../repositories/currency.repository";

export default class ShowApiCurrencyUseCase {
    constructor(private readonly currencyRepository: CurrencyRepository) {}
    async execute(code: string): Promise<CurrencyResponse | null> {
        return await this.currencyRepository.findByApi(code);
    }
}
