import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

import { ICurrenciesRepository } from "../../repositories/ICurrenciesRepository";

interface IRequest {
    symbol: string;
}

@injectable()
class CreateCurrencyUseCase {
    constructor(
        @inject("CurrenciesRepository")
        private currenciesRepository: ICurrenciesRepository
    ) {}
    async execute({ symbol }: IRequest): Promise<void> {
        const currencyAlreadyExists = await this.currenciesRepository.findBySymbol(
            symbol
        );

        if (currencyAlreadyExists) {
            throw new AppError("Currency already exists");
        }

        this.currenciesRepository.create({ symbol });
    }
}

export { CreateCurrencyUseCase };
