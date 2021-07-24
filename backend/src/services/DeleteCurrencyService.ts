import { inject, injectable } from 'tsyringe';

import { ICurrenciesRepository } from '@repositories/models/ICurrenciesRepository';

interface IRequest {
  code: string;
}

@injectable()
export class DeleteCurrencyService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,
  ) {}

  public async execute({ code }: IRequest): Promise<void> {
    await this.currenciesRepository.deleteByCode(code);
  }
}
