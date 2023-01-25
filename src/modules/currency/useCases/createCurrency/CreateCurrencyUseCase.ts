import { ICurrencyRepository } from "../../repositories/ICurrencyRepository";

interface IRquest {
    code: string;
    codein: string;
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

        this.currencyRepository.create({ code, codein, name, high, low });
    }
}

export { CreateCurrencyUseCase };
