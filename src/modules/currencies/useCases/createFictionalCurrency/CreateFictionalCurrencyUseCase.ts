import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { Currency } from "../../infra/typeorm/entities/Currency";
import { ICurrenciesRepository } from "../../repositories/ICurrenciesRepositories";

export interface ICreateFictionalCurrencyRequest {
  currencyCode: string;
  currencyName: string;
  priceUsd: number;
}

@injectable()
class CreateFictionalCurrencyUseCase {
  constructor(
    @inject("CurrenciesRepository")
    private currenciesRepository: ICurrenciesRepository
  ) {}

  async execute({
    currencyCode,
    currencyName,
    priceUsd,
  }: ICreateFictionalCurrencyRequest): Promise<Currency> {
    const currency = await this.currenciesRepository.getCurrencyByCode(
      currencyCode
    );

    if (currency) {
      throw new AppError("Currency already exists");
    }

    const newFictionalCurrency = await this.currenciesRepository.addCurrency({
      currencyCode,
      currencyName,
      priceUsd,
      isFictional: true,
    });

    return newFictionalCurrency;
  }
}

export { CreateFictionalCurrencyUseCase };
