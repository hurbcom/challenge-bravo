import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

import { ICurrenciesRepository } from "../../repositories/ICurrenciesRepository";

interface IRequest {
    symbol: string;
}

@injectable()
class DeleteCurrencyUseCase {
    constructor(
        @inject("CurrenciesRepository")
        private currenciesRepository: ICurrenciesRepository
    ) {}
    async execute({ symbol }: IRequest): Promise<void> {
        const currencyExists = await this.currenciesRepository.findBySymbol(
            symbol
        );

        if (!currencyExists) {
            throw new AppError("Currency not found", 404);
        }

        this.currenciesRepository.delete({ symbol });
    }
}

export { DeleteCurrencyUseCase };
