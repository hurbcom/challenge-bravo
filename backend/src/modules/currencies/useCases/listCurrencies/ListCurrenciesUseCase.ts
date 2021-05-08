import { inject, injectable } from "tsyringe";

import { Currency } from "@modules/currencies/infra/typeorm/entities/Currency";

import { ICurrenciesRepository } from "../../repositories/ICurrenciesRepository";

@injectable()
class ListCurrenciesUseCase {
    constructor(
        @inject("CurrenciesRepository")
        private currenciesRepository: ICurrenciesRepository
    ) {}

    async execute(): Promise<Currency[]> {
        const currencies = await this.currenciesRepository.list();

        return currencies;
    }
}

export { ListCurrenciesUseCase };
