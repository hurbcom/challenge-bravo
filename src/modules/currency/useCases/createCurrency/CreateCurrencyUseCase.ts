import { ICurrencyRepository } from "../../repositories/ICurrencyRepository";

interface IRquest {
    code: string;
    name: string;
    high: string;
    low: string;
}

class CreateCurrencyUseCase {
    constructor(private currencyRepository: ICurrencyRepository) {}

    async execute({ code, name, high, low }: IRquest): Promise<void> {
        const currencyAlredyExists = await this.currencyRepository.findByCode(
            code
        );

        if (currencyAlredyExists) {
            throw new Error("Coin alredy exists in database!");
        }

        this.currencyRepository.create({ code, name, high, low });
    }
}

export { CreateCurrencyUseCase };
