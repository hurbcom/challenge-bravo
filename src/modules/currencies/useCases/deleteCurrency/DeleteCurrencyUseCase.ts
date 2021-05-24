import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ICurrenciesRepository } from "../../repositories/ICurrenciesRepositories";

@injectable()
class DeleteCurrencyUseCase {
  constructor(
    @inject("CurrenciesRepository")
    private currenciesRepository: ICurrenciesRepository
  ) {}

  async execute(currencyCode: string): Promise<void> {
    const currency = await this.currenciesRepository.getCurrencyByCode(
      currencyCode
    );

    if (!currency) {
      throw new AppError("Currency does not exists!");
    }

    await this.currenciesRepository.deleteCurrency(currency.id);
  }
}

export { DeleteCurrencyUseCase };
