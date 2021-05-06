import { Currency } from "../../../../model/Currency";
import { ICurrenciesRepository } from "../../repositories/ICurrenciesRepository";

class ListCurrenciesUseCase {
    constructor(private currenciesRepository: ICurrenciesRepository) {}
    execute(): Currency[] {
        const currencies = this.currenciesRepository.list();

        return currencies;
    }
}

export { ListCurrenciesUseCase };
