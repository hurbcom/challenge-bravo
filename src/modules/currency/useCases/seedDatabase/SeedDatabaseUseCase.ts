import { ICurrencyRepository } from "../../repositories/ICurrencyRepository";

class SeedDatabaseUseCase {
    constructor(private currencyRepository: ICurrencyRepository) {}

    async execute(): Promise<void> {
        this.currencyRepository.defaultCoins();
    }
}

export { SeedDatabaseUseCase };
