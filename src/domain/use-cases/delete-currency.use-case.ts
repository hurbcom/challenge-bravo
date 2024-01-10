import PersistenceError from "../errors/persistence.error";
import CurrencyRepository from "../repositories/currency.repository";

export default class DeleteCurrencyUseCase {
    constructor(private readonly currencyRepository: CurrencyRepository) {}

    async execute(code: string): Promise<void> {
        try {
            await this.currencyRepository.deleteCurrency(code);
        } catch (e) {
            throw new PersistenceError();
        }
    }
}
