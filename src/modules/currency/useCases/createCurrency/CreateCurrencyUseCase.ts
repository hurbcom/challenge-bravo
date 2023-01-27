import { ICurrencyRepository } from "../../repositories/ICurrencyRepository";

interface IRquest {
    code: string;
    name: string;
    ask: string;
}

class CreateCurrencyUseCase {
    constructor(private currencyRepository: ICurrencyRepository) {}

    async execute({ code, ask, name }: IRquest): Promise<void> {
        if ([code, ask, name].includes(undefined)) {
            throw new Error(
                "Please, inform values to variables code, ask and name!"
            );
        }

        const currencyAlredyExists = await this.currencyRepository.findByCode(
            code
        );

        if (currencyAlredyExists) {
            throw new Error("Coin alredy exists in database!");
        }

        this.currencyRepository.create({
            code,
            ask,
            name,
        });
    }
}

export { CreateCurrencyUseCase };
