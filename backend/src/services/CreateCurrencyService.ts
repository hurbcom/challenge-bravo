import { ICurrenciesRepository } from "../repositories/ICurrenciesRepositpry";

interface IRequest {
    symbol: string;
}

class CreateCurrencyService {
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

export { CreateCurrencyService };
