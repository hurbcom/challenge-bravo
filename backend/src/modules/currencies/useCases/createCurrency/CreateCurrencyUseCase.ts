import { ICurrenciesRepository } from "../../repositories/ICurrenciesRepository";

interface IRequest {
    symbol: string;
}

class CreateCurrencyUseCase {
    constructor(private currenciesRepository: ICurrenciesRepository) {}
    execute({ symbol }: IRequest): void {
        const currencyAlreadyExists = this.currenciesRepository.findBySymbol(
            symbol
        );

        if (currencyAlreadyExists) {
            throw new Error("Currency already exists");
        }

        this.currenciesRepository.create({ symbol });
    }
}

export { CreateCurrencyUseCase };
