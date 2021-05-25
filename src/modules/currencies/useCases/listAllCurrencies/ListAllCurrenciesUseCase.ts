import { inject, injectable } from "tsyringe";

import { Currency } from "../../infra/typeorm/entities/Currency";
import { ICurrenciesRepository } from "../../repositories/ICurrenciesRepositories";

@injectable()
class ListAllCurrenciesUseCase {
  constructor(
    @inject("CurrenciesRepository")
    private currenciesRepository: ICurrenciesRepository
  ) {}

  async execute(): Promise<Currency[]> {
    const all = await this.currenciesRepository.getAll();

    return all;
  }
}

export { ListAllCurrenciesUseCase };
