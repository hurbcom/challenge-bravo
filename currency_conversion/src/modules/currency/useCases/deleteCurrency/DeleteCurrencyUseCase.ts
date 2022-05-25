import { inject, injectable } from "tsyringe";

import { ICurrenciesRepository } from "@modules/currency/repositories/ICurrenciesRepository";

interface IRequest {
  id: string;
}

@injectable()
class DeleteCurrencyUseCase {
  constructor(
    @inject("CurrenciesRepository")
    private currenciesRepository: ICurrenciesRepository
  ) {}

  async execute({ id }: IRequest): Promise<void> {
    await this.currenciesRepository.delete(id);
  }
}

export { DeleteCurrencyUseCase };
