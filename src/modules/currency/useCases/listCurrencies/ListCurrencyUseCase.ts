import { Currency } from "../../entities/Currency";
import { ICurrencyRepository } from "../../repositories/ICurrencyRepository";

class ListCurrencyUseCase {
    constructor(private currancyRepository: ICurrencyRepository) {}

    async execute(): Currency[] {
        const currency = await this.currancyRepository.list();

        return currency;
    }
}

export { ListCurrencyUseCase };
