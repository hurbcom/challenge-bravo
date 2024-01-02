import PersistenceError from "../errors/persistence.error";
import CurrencyRepository from "../repositories/currency.repository";

export default class DeleteCurrencyUseCase {
    constructor(private readonly currencyRepository: CurrencyRepository) {}

    async execute(_id: string): Promise<void> {
        try {
            await this.currencyRepository.deleteCurrency(_id);
        } catch (e) {
            throw new PersistenceError();
        }
    }
}
