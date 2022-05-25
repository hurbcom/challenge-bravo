import { inject, injectable } from "tsyringe";

import { ICurrenciesRepository } from "@modules/currency/repositories/ICurrenciesRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  name: string;
}

@injectable()
class CreateCurrencyUseCase {
  constructor(
    @inject("CurrenciesRepository")
    private currenciesRepository: ICurrenciesRepository
  ) {}

  async execute({ name }: IRequest): Promise<void> {
    const currencyAlreadyExists = await this.currenciesRepository.findByName(name);

    if (currencyAlreadyExists) {
      console.log("enviei o erro");
      throw new AppError("Currency already exists");
    }

    await this.currenciesRepository.create({
      name,
    });
  }
}

export { CreateCurrencyUseCase };
